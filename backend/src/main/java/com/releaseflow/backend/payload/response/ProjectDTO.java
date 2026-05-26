package com.releaseflow.backend.payload.response;

import com.releaseflow.backend.model.Project;
import java.time.LocalDateTime;

public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private String createdBy;
    private String vercelToken;
    private String vercelProjectId;

    public ProjectDTO(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.createdAt = project.getCreatedAt();
        this.createdBy = project.getCreatedBy() != null ? project.getCreatedBy().getUsername() : null;
        this.vercelToken = project.getVercelToken();
        this.vercelProjectId = project.getVercelProjectId();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getCreatedBy() { return createdBy; }
    public String getVercelToken() { return vercelToken; }
    public String getVercelProjectId() { return vercelProjectId; }
}
