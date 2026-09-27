package com.recruitment.portal.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.recruitment.portal.entity.Application;
import com.recruitment.portal.entity.Job;
import com.recruitment.portal.repository.ApplicationRepository;
import com.recruitment.portal.repository.JobRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;


    // =========================================================
    // CANDIDATE - APPLY FOR JOB WITH RESUME
    // =========================================================

    public String applyJob(
            Long jobId,
            MultipartFile file,
            String candidateEmail) throws IOException {

        // Check resume
        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "Resume is required to apply for this job."
            );
        }

        // Check job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found")
                );

        // Check deadline
        if (job.getApplicationDeadline() != null &&
                job.getApplicationDeadline()
                        .isBefore(java.time.LocalDate.now())) {

            throw new RuntimeException(
                    "Application deadline has passed."
            );
        }

        // Check duplicate application
        List<Application> existingApplications =
                applicationRepository
                        .findByCandidateEmail(candidateEmail);

        boolean alreadyApplied =
                existingApplications.stream()
                        .anyMatch(application ->
                                application.getJob()
                                        .getId()
                                        .equals(jobId)
                        );

        if (alreadyApplied) {
            throw new RuntimeException(
                    "You have already applied for this job."
            );
        }

        // Create application
        Application application = new Application();

        application.setJob(job);

        application.setCandidateEmail(
                candidateEmail
        );

        application.setStatus(
                "APPLIED"
        );

        // Save resume
        String uploadDir = "uploads/";

        Files.createDirectories(
                Paths.get(uploadDir)
        );

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.trim().isEmpty()) {

            originalFileName = "resume";
        }

        String fileName =
                System.currentTimeMillis()
                        + "_"
                        + originalFileName;

        Path filePath =
                Paths.get(
                        uploadDir + fileName
                );

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        application.setResumePath(
                filePath.toString()
        );

        applicationRepository.save(
                application
        );

        return "Application submitted successfully with resume.";
    }


    // =========================================================
    // CANDIDATE - VIEW MY APPLICATIONS
    // =========================================================

    public List<Application> getMyApplications(
            String candidateEmail) {

        return applicationRepository
                .findByCandidateEmail(candidateEmail);
    }


    // =========================================================
    // RECRUITER - VIEW ALL APPLICANTS
    // =========================================================

    public List<Application> getAllApplicants() {

        return applicationRepository.findAll();
    }


    // =========================================================
    // RECRUITER - VIEW APPLICANTS FOR ONE JOB
    // =========================================================

    public List<Application> getApplicants(
            Long jobId) {

        return applicationRepository
                .findByJobId(jobId);
    }


    // =========================================================
    // GET RESUME PATH
    // =========================================================

    public String getResumePath(
            Long applicationId) {

        Application application =
                applicationRepository
                        .findById(applicationId)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        if (application.getResumePath() == null ||
                application.getResumePath().isBlank()) {

            throw new RuntimeException(
                    "Resume has not been uploaded."
            );
        }

        return application.getResumePath();
    }


    // =========================================================
    // OLD RESUME UPLOAD
    // =========================================================

    public String uploadResume(
            Long applicationId,
            MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Please select a resume."
            );
        }

        Application application =
                applicationRepository
                        .findById(applicationId)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        String uploadDir = "uploads/";

        Files.createDirectories(
                Paths.get(uploadDir)
        );

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {

            originalFileName = "resume";
        }

        String fileName =
                System.currentTimeMillis()
                        + "_"
                        + originalFileName;

        Path filePath =
                Paths.get(
                        uploadDir + fileName
                );

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        application.setResumePath(
                filePath.toString()
        );

        applicationRepository.save(
                application
        );

        return "Resume uploaded successfully.";
    }


    // =========================================================
    // RECRUITER - SHORTLIST / REJECT
    // =========================================================

    public Application updateStatus(
            Long applicationId,
            String status) {

        Application application =
                applicationRepository
                        .findById(applicationId)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        // Resume required
        if (application.getResumePath() == null ||
                application.getResumePath().isBlank()) {

            throw new RuntimeException(
                    "Candidate must upload a resume before the application can be shortlisted or rejected."
            );
        }

        // Valid status
        if (!status.equals("SHORTLISTED") &&
                !status.equals("REJECTED")) {

            throw new RuntimeException(
                    "Invalid application status."
            );
        }

        application.setStatus(status);

        return applicationRepository.save(
                application
        );
    }
}