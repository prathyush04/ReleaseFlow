package com.releaseflow.backend.controller;

import com.releaseflow.backend.model.Project;
import com.releaseflow.backend.payload.request.ProjectRequest;
import com.releaseflow.backend.payload.response.ProjectDTO;
import com.releaseflow.backend.service.ProjectService;
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
@RequestMapping("/api/projects")
@Tag(name = "Project Management", description = "APIs for managing projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('RELEASE_MANAGER') or hasRole('DEVELOPER')")
    @Operation(summary = "Get all projects")
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> dtos = projectService.getAllProjects().stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new project")
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectRequest request, Authentication authentication) {
        Project project = projectService.createProject(request, authentication.getName());
        return ResponseEntity.ok(new ProjectDTO(project));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing project")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @RequestBody ProjectRequest request, Authentication authentication) {
        Project project = projectService.updateProject(id, request, authentication.getName());
        return ResponseEntity.ok(new ProjectDTO(project));
    }
}
