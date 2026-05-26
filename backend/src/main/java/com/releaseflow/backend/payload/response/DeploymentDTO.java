package com.releaseflow.backend.payload.response;

import com.releaseflow.backend.model.Deployment;
import java.time.LocalDateTime;

public class DeploymentDTO {
    private Long id;
    private String environment;
    private String status;
    private boolean isRollback;
    private String logs;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public DeploymentDTO(Deployment deployment) {
        this.id = deployment.getId();
        this.environment = deployment.getEnvironment();
        this.status = deployment.getStatus();
        this.isRollback = deployment.isRollback();
        this.logs = deployment.getLogs();
        this.startedAt = deployment.getStartedAt();
        this.completedAt = deployment.getCompletedAt();
    }

    public Long getId() { return id; }
    public String getEnvironment() { return environment; }
    public String getStatus() { return status; }
    public boolean isRollback() { return isRollback; }
    public String getLogs() { return logs; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
}
