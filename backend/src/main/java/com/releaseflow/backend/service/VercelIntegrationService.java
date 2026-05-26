package com.releaseflow.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.releaseflow.backend.model.Deployment;
import com.releaseflow.backend.model.Project;
import com.releaseflow.backend.repository.DeploymentRepository;
import com.releaseflow.backend.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VercelIntegrationService {

    private static final Logger logger = LoggerFactory.getLogger(VercelIntegrationService.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DeploymentRepository deploymentRepository;

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void pollVercelStatuses() {
        List<Project> projects = projectRepository.findAll();
        for (Project project : projects) {
            String token = project.getVercelToken();
            String vercelProjectId = project.getVercelProjectId();
            
            if (token == null || token.trim().isEmpty() || vercelProjectId == null || vercelProjectId.trim().isEmpty()) {
                continue;
            }

            List<Deployment> activeDeployments = deploymentRepository.findAll().stream()
                .filter(d -> d.getRelease().getProject().getId().equals(project.getId()))
                .filter(d -> "QUEUED".equals(d.getStatus()) || "IN_PROGRESS".equals(d.getStatus()))
                .toList();

            if (activeDeployments.isEmpty()) {
                continue;
            }

            try {
                String url = "https://api.vercel.com/v6/deployments?projectId=" + vercelProjectId + "&limit=1";
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "Bearer " + token);
                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
                
                if (response.getStatusCode().is2xxSuccessful()) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    JsonNode deployments = root.path("deployments");
                    if (deployments.isArray() && !deployments.isEmpty()) {
                        JsonNode latestVercelDeploy = deployments.get(0);
                        String state = latestVercelDeploy.path("state").asText();
                        String mappedStatus = mapVercelStateToOurStatus(state);
                        String urlPath = latestVercelDeploy.path("url").asText();
                        String logs = "Vercel Build State: " + state + "\n";
                        if (urlPath != null && !urlPath.isEmpty()) {
                            logs += "Vercel URL: https://" + urlPath + "\n";
                        }

                        for (Deployment d : activeDeployments) {
                            if (!d.getStatus().equals(mappedStatus)) {
                                d.setStatus(mappedStatus);
                                d.setLogs(d.getLogs() == null ? logs : d.getLogs() + logs);
                                if ("SUCCESS".equals(mappedStatus) || "FAILED".equals(mappedStatus) || "CANCELLED".equals(mappedStatus)) {
                                    d.setCompletedAt(LocalDateTime.now());
                                }
                                deploymentRepository.save(d);
                            }
                        }
                    }
                }
            } catch (Exception e) {
                logger.error("Failed to poll Vercel API for project: " + project.getName(), e);
            }
        }
    }

    private String mapVercelStateToOurStatus(String vercelState) {
        switch (vercelState) {
            case "READY": return "SUCCESS";
            case "ERROR": return "FAILED";
            case "CANCELED": return "CANCELLED";
            case "BUILDING":
            case "INITIALIZING": return "IN_PROGRESS";
            default: return "QUEUED";
        }
    }
}
