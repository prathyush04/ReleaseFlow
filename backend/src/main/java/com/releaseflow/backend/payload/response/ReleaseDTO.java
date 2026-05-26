package com.releaseflow.backend.payload.response;

import com.releaseflow.backend.model.Release;
import java.time.LocalDateTime;

public class ReleaseDTO {
    private Long id;
    private String name;
    private String version;
    private String description;
    private String webhookUrl;
    private String status;
    private LocalDateTime createdAt;
    private String createdBy;
    private Long projectId;

    public ReleaseDTO(Release release) {
        this.id = release.getId();
        this.name = release.getName();
        this.version = release.getVersion();
        this.description = release.getDescription();
        this.webhookUrl = release.getWebhookUrl();
        this.status = release.getStatus();
        this.createdAt = release.getCreatedAt();
        this.createdBy = release.getCreatedBy() != null ? release.getCreatedBy().getUsername() : null;
        this.projectId = release.getProject() != null ? release.getProject().getId() : null;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getVersion() { return version; }
    public String getDescription() { return description; }
    public String getWebhookUrl() { return webhookUrl; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getCreatedBy() { return createdBy; }
    public Long getProjectId() { return projectId; }
}
