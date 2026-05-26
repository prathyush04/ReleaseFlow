package com.releaseflow.backend.controller;

import com.releaseflow.backend.payload.response.DashboardResponse;
import com.releaseflow.backend.repository.DeploymentRepository;
import com.releaseflow.backend.repository.ReleaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ReleaseRepository releaseRepository;

    @Autowired
    private DeploymentRepository deploymentRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RELEASE_MANAGER') or hasRole('DEVELOPER')")
    public DashboardResponse getStats(@RequestParam(required = false) Long projectId) {
        if (projectId == null) {
            return new DashboardResponse(0L, 0L);
        }
        long releaseCount = releaseRepository.countByProjectId(projectId);
        long deploymentCount = deploymentRepository.countByReleaseProjectId(projectId);
        return new DashboardResponse(releaseCount, deploymentCount);
    }
}
