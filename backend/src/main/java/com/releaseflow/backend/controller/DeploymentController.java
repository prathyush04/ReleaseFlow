package com.releaseflow.backend.controller;

import com.releaseflow.backend.model.Deployment;
import com.releaseflow.backend.payload.request.DeploymentRequest;
import com.releaseflow.backend.payload.response.DeploymentDTO;
import com.releaseflow.backend.service.DeploymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/deployments")
@Tag(name = "Deployments", description = "Endpoints for triggering and viewing deployments")
public class DeploymentController {

    @Autowired
    private DeploymentService deploymentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('RELEASE_MANAGER')")
    @Operation(summary = "Trigger a new deployment")
    public ResponseEntity<DeploymentDTO> triggerDeployment(@RequestBody DeploymentRequest request, Authentication authentication) {
        Deployment deployment = deploymentService.triggerDeployment(request, authentication.getName(), false);
        return ResponseEntity.ok(new DeploymentDTO(deployment));
    }

    @PostMapping("/rollback")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RELEASE_MANAGER')")
    @Operation(summary = "Trigger a rollback deployment")
    public ResponseEntity<DeploymentDTO> triggerRollback(@RequestBody DeploymentRequest request, Authentication authentication) {
        Deployment deployment = deploymentService.triggerDeployment(request, authentication.getName(), true);
        return ResponseEntity.ok(new DeploymentDTO(deployment));
    }

    @GetMapping("/release/{releaseId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RELEASE_MANAGER') or hasRole('DEVELOPER')")
    @Operation(summary = "Get deployments by release ID")
    public ResponseEntity<List<DeploymentDTO>> getDeploymentsByRelease(@PathVariable Long releaseId) {
        List<DeploymentDTO> dtos = deploymentService.getDeploymentsByRelease(releaseId)
                .stream()
                .map(DeploymentDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
