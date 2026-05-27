package com.releaseflow.backend.service;

import com.releaseflow.backend.model.Deployment;
import com.releaseflow.backend.model.Release;
import com.releaseflow.backend.model.User;
import com.releaseflow.backend.payload.request.DeploymentRequest;
import com.releaseflow.backend.repository.DeploymentRepository;
import com.releaseflow.backend.repository.ReleaseRepository;
import com.releaseflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DeploymentService {

    @Autowired
    private DeploymentRepository deploymentRepository;

    @Autowired
    private ReleaseRepository releaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    @Autowired
    private CacheManager cacheManager;

    @CacheEvict(value = "deployments", key = "#request.releaseId")
    public Deployment triggerDeployment(DeploymentRequest request, String username, boolean isRollback) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Release release = releaseRepository.findById(request.getReleaseId()).orElseThrow();

        // Evict dashboard stats for this project
        if (cacheManager.getCache("dashboardStats") != null) {
            cacheManager.getCache("dashboardStats").evict(release.getProject().getId());
        }

        Deployment deployment = new Deployment();
        deployment.setRelease(release);
        deployment.setEnvironment(request.getEnvironment());
        deployment.setStatus("QUEUED");
        deployment.setRollback(isRollback);
        deployment.setTriggeredBy(user);
        deployment.setStartedAt(LocalDateTime.now());
        deployment.setLogs("Queued for deployment...\n");

        Deployment saved = deploymentRepository.save(deployment);

        String action = isRollback ? "ROLLBACK" : "START_DEPLOYMENT";
        auditService.logAction(action, "DEPLOYMENT", saved.getId(), user, "Triggered " + action + " for Release " + release.getVersion());

        release.setStatus("IN_PROGRESS");
        releaseRepository.save(release);

        String webhookUrl = release.getWebhookUrl();
        if (webhookUrl != null && !webhookUrl.trim().isEmpty()) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                Map<String, String> payload = new HashMap<>();
                payload.put("environment", request.getEnvironment());
                ResponseEntity<String> response = restTemplate.postForEntity(webhookUrl, payload, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    saved.setLogs("Triggered Vercel webhook successfully. Waiting for Vercel status...\n");
                } else {
                    saved.setStatus("FAILED");
                    saved.setLogs("Webhook failed with status: " + response.getStatusCode() + "\n");
                    saved.setCompletedAt(LocalDateTime.now());
                }
                deploymentRepository.save(saved);
            } catch (Exception e) {
                saved.setStatus("FAILED");
                saved.setLogs("Failed to trigger webhook: " + e.getMessage() + "\n");
                saved.setCompletedAt(LocalDateTime.now());
                deploymentRepository.save(saved);
            }
        }

        return saved;
    }

    @Cacheable(value = "deployments", key = "#releaseId")
    public List<Deployment> getDeploymentsByRelease(Long releaseId) {
        return deploymentRepository.findByReleaseId(releaseId);
    }
}
