package com.releaseflow.backend.payload.request;

public class ProjectRequest {
    private String name;
    private String description;
    private String vercelToken;
    private String vercelProjectId;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getVercelToken() { return vercelToken; }
    public void setVercelToken(String vercelToken) { this.vercelToken = vercelToken; }
    public String getVercelProjectId() { return vercelProjectId; }
    public void setVercelProjectId(String vercelProjectId) { this.vercelProjectId = vercelProjectId; }
}
