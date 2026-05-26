package com.releaseflow.backend.service;

import com.releaseflow.backend.model.Project;
import com.releaseflow.backend.model.Release;
import com.releaseflow.backend.model.User;
import com.releaseflow.backend.payload.request.ReleaseRequest;
import com.releaseflow.backend.repository.ProjectRepository;
import com.releaseflow.backend.repository.ReleaseRepository;
import com.releaseflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReleaseService {

    @Autowired
    private ReleaseRepository releaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AuditService auditService;

    public Release createRelease(ReleaseRequest request, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (request.getProjectId() == null) {
            throw new RuntimeException("Project ID is required");
        }
        
        Project project = projectRepository.findById(request.getProjectId())
            .orElseThrow(() -> new RuntimeException("Project not found"));

        if (releaseRepository.existsByProjectIdAndVersion(project.getId(), request.getVersion())) {
            throw new RuntimeException("Release version already exists in this project");
        }

        Release release = new Release();
        release.setName(request.getName());
        release.setVersion(request.getVersion());
        release.setDescription(request.getDescription());
        release.setWebhookUrl(request.getWebhookUrl());
        release.setProject(project);
        release.setStatus("DRAFT");
        release.setCreatedBy(user);
        release.setCreatedAt(LocalDateTime.now());

        Release saved = releaseRepository.save(release);
        auditService.logAction("CREATE_RELEASE", "RELEASE", saved.getId(), user, "Created release " + saved.getVersion());
        return saved;
    }

    public List<Release> getReleasesByProject(Long projectId) {
        return releaseRepository.findByProjectId(projectId);
    }
}
