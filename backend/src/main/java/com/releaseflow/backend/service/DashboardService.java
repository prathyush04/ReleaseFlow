package com.releaseflow.backend.service;

import com.releaseflow.backend.payload.response.DashboardResponse;
import com.releaseflow.backend.repository.DeploymentRepository;
import com.releaseflow.backend.repository.ReleaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private ReleaseRepository releaseRepository;

    @Autowired
    private DeploymentRepository deploymentRepository;

    @Cacheable(value = "dashboardStats", key = "#projectId != null ? #projectId : 0")
    public DashboardResponse getStats(Long projectId) {
        if (projectId == null) {
            return new DashboardResponse(0L, 0L);
        }
        long releaseCount = releaseRepository.countByProjectId(projectId);
        long deploymentCount = deploymentRepository.countByReleaseProjectId(projectId);
        return new DashboardResponse(releaseCount, deploymentCount);
    }
}
