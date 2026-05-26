package com.releaseflow.backend.service;

import com.releaseflow.backend.model.Project;
import com.releaseflow.backend.model.User;
import com.releaseflow.backend.payload.request.ProjectRequest;
import com.releaseflow.backend.repository.ProjectRepository;
import com.releaseflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Transactional
    public Project createProject(ProjectRequest request, String username) {
        if (projectRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Error: Project name is already taken!");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setVercelToken(request.getVercelToken());
        project.setVercelProjectId(request.getVercelProjectId());
        project.setCreatedBy(user);

        Project saved = projectRepository.save(project);
        
        auditService.logAction("CREATE_PROJECT", "Project", saved.getId(), user, "Project created: " + saved.getName());
        return saved;
    }

    @Transactional
    public Project updateProject(Long id, ProjectRequest request, String username) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Project is not found."));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        if (!project.getName().equals(request.getName()) && projectRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Error: Project name is already taken!");
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setVercelToken(request.getVercelToken());
        project.setVercelProjectId(request.getVercelProjectId());

        Project saved = projectRepository.save(project);
        auditService.logAction("UPDATE_PROJECT", "Project", saved.getId(), user, "Project updated: " + saved.getName());
        return saved;
    }
}
