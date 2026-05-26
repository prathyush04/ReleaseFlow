package com.releaseflow.backend.repository;

import com.releaseflow.backend.model.Release;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReleaseRepository extends JpaRepository<Release, Long> {
    boolean existsByProjectIdAndVersion(Long projectId, String version);
    List<Release> findByProjectId(Long projectId);
    long countByProjectId(Long projectId);
}
