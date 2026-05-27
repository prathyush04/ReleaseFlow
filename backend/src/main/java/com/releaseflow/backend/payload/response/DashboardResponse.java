package com.releaseflow.backend.payload.response;

public class DashboardResponse implements java.io.Serializable {
    private long releases;
    private long deployments;

    public DashboardResponse() {}

    public DashboardResponse(long releases, long deployments) {
        this.releases = releases;
        this.deployments = deployments;
    }

    public long getReleases() { return releases; }
    public void setReleases(long releases) { this.releases = releases; }
    public long getDeployments() { return deployments; }
    public void setDeployments(long deployments) { this.deployments = deployments; }
}
