package com.releaseflow.backend.controller;

import com.releaseflow.backend.model.Release;
import com.releaseflow.backend.payload.request.ReleaseRequest;
import com.releaseflow.backend.payload.response.ReleaseDTO;
import com.releaseflow.backend.service.ReleaseService;
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
@RequestMapping("/api/releases")
@Tag(name = "Releases", description = "Endpoints for managing releases")
public class ReleaseController {

    @Autowired
    private ReleaseService releaseService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('RELEASE_MANAGER')")
    @Operation(summary = "Create a new release")
    public ResponseEntity<ReleaseDTO> createRelease(@RequestBody ReleaseRequest request, Authentication authentication) {
        Release release = releaseService.createRelease(request, authentication.getName());
        return ResponseEntity.ok(new ReleaseDTO(release));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('RELEASE_MANAGER') or hasRole('DEVELOPER')")
    @Operation(summary = "Get all releases for a project")
    public ResponseEntity<List<ReleaseDTO>> getReleasesByProject(@RequestParam Long projectId) {
        List<ReleaseDTO> dtos = releaseService.getReleasesByProject(projectId).stream()
                .map(ReleaseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
