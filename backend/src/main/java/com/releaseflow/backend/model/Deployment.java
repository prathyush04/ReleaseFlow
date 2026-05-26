package com.releaseflow.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deployments")
public class Deployment implements java.io.Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "release_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "deployments"})
    private Release release;

    @Column(nullable = false)
    private String environment;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private boolean isRollback = false;

    @Column(columnDefinition = "TEXT")
    private String logs;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "triggered_by", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User triggeredBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime startedAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    public Deployment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Release getRelease() { return release; }
    public void setRelease(Release release) { this.release = release; }
    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isRollback() { return isRollback; }
    public void setRollback(boolean rollback) { isRollback = rollback; }
    public String getLogs() { return logs; }
    public void setLogs(String logs) { this.logs = logs; }
    public User getTriggeredBy() { return triggeredBy; }
    public void setTriggeredBy(User triggeredBy) { this.triggeredBy = triggeredBy; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
