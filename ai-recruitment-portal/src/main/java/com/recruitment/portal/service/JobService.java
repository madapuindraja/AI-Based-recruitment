package com.recruitment.portal.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recruitment.portal.dto.JobRequest;
import com.recruitment.portal.entity.Job;
import com.recruitment.portal.repository.JobRepository;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;


    // ==========================================
    // CREATE JOB
    // ==========================================

    public String createJob(JobRequest request) {

        Job job = new Job();

        job.setJobTitle(request.getJobTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setDescription(request.getDescription());
        job.setSkills(request.getSkills());
        job.setSalary(request.getSalary());
        job.setApplicationDeadline(
                request.getApplicationDeadline()
        );

        // Automatically determine status

        if (request.getApplicationDeadline() != null
                && request.getApplicationDeadline()
                    .isBefore(LocalDate.now())) {

            job.setStatus("CLOSED");

        } else {

            job.setStatus("OPEN");
        }

        jobRepository.save(job);

        return "Job Created Successfully";
    }


    // ==========================================
    // GET ALL JOBS
    // ==========================================

    public List<Job> getAllJobs() {

        List<Job> jobs = jobRepository.findAll();

        // Automatically close expired jobs

        for (Job job : jobs) {

            if (job.getApplicationDeadline() != null
                    && job.getApplicationDeadline()
                        .isBefore(LocalDate.now())
                    && !"CLOSED".equals(job.getStatus())) {

                job.setStatus("CLOSED");

                jobRepository.save(job);
            }
        }

        return jobs;
    }


    // ==========================================
    // UPDATE JOB
    // ==========================================

    public String updateJob(
            Long jobId,
            JobRequest request) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );

        job.setJobTitle(request.getJobTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setDescription(request.getDescription());
        job.setSkills(request.getSkills());
        job.setSalary(request.getSalary());
        job.setApplicationDeadline(
                request.getApplicationDeadline()
        );


        // Update status based on deadline

        if (request.getApplicationDeadline() != null
                && request.getApplicationDeadline()
                    .isBefore(LocalDate.now())) {

            job.setStatus("CLOSED");

        } else {

            job.setStatus("OPEN");
        }


        jobRepository.save(job);

        return "Job Updated Successfully";
    }


    // ==========================================
    // DELETE JOB
    // ==========================================

    public String deleteJob(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );

        jobRepository.delete(job);

        return "Job Deleted Successfully";
    }
}