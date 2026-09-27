package com.recruitment.portal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recruitment.portal.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Applicants for a particular job
    List<Application> findByJobId(Long jobId);

    // Applications submitted by a candidate
    List<Application> findByCandidateEmail(String candidateEmail);
}