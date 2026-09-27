package com.recruitment.portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.recruitment.portal.entity.Job;

public interface JobRepository extends JpaRepository<Job, Long> {

}
