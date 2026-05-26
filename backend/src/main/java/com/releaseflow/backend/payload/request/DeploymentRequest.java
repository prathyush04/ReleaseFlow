package com.releaseflow.backend.payload.request;

public class DeploymentRequest {
    private Long releaseId;
    private String environment;

    public DeploymentRequest() {}

    public Long getReleaseId() { return releaseId; }
    public void setReleaseId(Long releaseId) { this.releaseId = releaseId; }
    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }
}
