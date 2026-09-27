package com.recruitment.portal.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.recruitment.portal.dto.StatusUpdateRequest;
import com.recruitment.portal.service.ApplicationService;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;


    // =========================================================
    // CANDIDATE - APPLY FOR JOB WITH RESUME
    // =========================================================

    @PostMapping("/apply")
    public ResponseEntity<?> applyJob(
            @RequestParam Long jobId,
            @RequestParam MultipartFile file,
            Principal principal) throws IOException {

        String email = principal.getName();

        return ResponseEntity.ok(
                applicationService.applyJob(
                        jobId,
                        file,
                        email
                )
        );
    }


    // =========================================================
    // CANDIDATE - VIEW MY APPLICATIONS
    // =========================================================

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(
            Principal principal) {

        String email = principal.getName();

        return ResponseEntity.ok(
                applicationService
                        .getMyApplications(email)
        );
    }


    // =========================================================
    // RECRUITER - VIEW ALL APPLICANTS
    // =========================================================

    @GetMapping("/all")
    public ResponseEntity<?> getAllApplicants() {

        return ResponseEntity.ok(
                applicationService
                        .getAllApplicants()
        );
    }


    // =========================================================
    // RECRUITER - VIEW APPLICANTS FOR ONE JOB
    // =========================================================

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getApplicants(
            @PathVariable Long jobId) {

        return ResponseEntity.ok(
                applicationService
                        .getApplicants(jobId)
        );
    }


    // =========================================================
    // RECRUITER - VIEW RESUME
    // =========================================================

    @GetMapping("/{applicationId}/resume")
    public ResponseEntity<Resource> viewResume(
            @PathVariable Long applicationId) {

        try {

            String resumePath =
                    applicationService
                            .getResumePath(applicationId);

            Path path =
                    Paths.get(resumePath);

            Resource resource =
                    new UrlResource(
                            path.toUri()
                    );

            if (!resource.exists() ||
                    !resource.isReadable()) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            String contentType =
                    Files.probeContentType(path);

            if (contentType == null) {

                contentType =
                        MediaType
                                .APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(
                            MediaType.parseMediaType(
                                    contentType
                            )
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" +
                                    path.getFileName()
                                            .toString() +
                                    "\""
                    )
                    .body(resource);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }


    // =========================================================
    // OLD RESUME UPLOAD
    // =========================================================

    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(
            @RequestParam Long applicationId,
            @RequestParam MultipartFile file)
            throws IOException {

        return ResponseEntity.ok(
                applicationService.uploadResume(
                        applicationId,
                        file
                )
        );
    }


    // =========================================================
    // RECRUITER - UPDATE STATUS
    // =========================================================

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody StatusUpdateRequest request) {

        return ResponseEntity.ok(
                applicationService.updateStatus(
                        applicationId,
                        request.getStatus()
                )
        );
    }
}