package com.recruitment.portal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.recruitment.portal.dto.JobRequest;
import com.recruitment.portal.service.JobService;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;


    // ==========================================
    // CREATE JOB
    // ==========================================

    @PostMapping("/create")
    public ResponseEntity<?> createJob(
            @RequestBody JobRequest request) {

        return ResponseEntity.ok(
                jobService.createJob(request)
        );
    }


    // ==========================================
    // GET ALL JOBS
    // ==========================================

    @GetMapping("/all")
    public ResponseEntity<?> getAllJobs() {

        return ResponseEntity.ok(
                jobService.getAllJobs()
        );
    }


    // ==========================================
    // UPDATE JOB
    // ==========================================

    @PutMapping("/{jobId}")
    public ResponseEntity<?> updateJob(
            @PathVariable Long jobId,
            @RequestBody JobRequest request) {

        return ResponseEntity.ok(
                jobService.updateJob(
                        jobId,
                        request
                )
        );
    }


    // ==========================================
    // DELETE JOB
    // ==========================================

    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> deleteJob(
            @PathVariable Long jobId) {

        return ResponseEntity.ok(
                jobService.deleteJob(jobId)
        );
    }
}