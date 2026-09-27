package com.recruitment.portal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recruitment.portal.entity.Application;
import com.recruitment.portal.entity.Interview;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    boolean existsByApplication(Application application);

    List<Interview> findByApplicationCandidateEmail(String email);

}