package com.recruitment.portal.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.recruitment.portal.dto.InterviewRequest;
import com.recruitment.portal.dto.StatusUpdateRequest;
import com.recruitment.portal.service.InterviewService;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;


    // =====================================================
    // SCHEDULE INTERVIEW
    // =====================================================

    @PostMapping("/schedule")
    public ResponseEntity<?> schedule(
            @RequestBody InterviewRequest request) {

        return ResponseEntity.ok(
                interviewService.scheduleInterview(request));
    }


    // =====================================================
    // CANDIDATE - MY INTERVIEWS
    // =====================================================

    @GetMapping("/my-interviews")
    public ResponseEntity<?> myInterviews(
            Principal principal) {

        return ResponseEntity.ok(
                interviewService.getMyInterviews(
                        principal.getName()));
    }


    // =====================================================
    // RECRUITER - ALL INTERVIEWS
    // =====================================================

    @GetMapping("/all")
    public ResponseEntity<?> getAllInterviews() {

        return ResponseEntity.ok(
                interviewService.getAllInterviews());
    }


    // =====================================================
    // RECRUITER - INTERVIEW DASHBOARD
    // =====================================================

    @GetMapping("/dashboard")
    public ResponseEntity<?> getInterviewDashboard() {

        return ResponseEntity.ok(
                interviewService.getInterviewDashboard());
    }


    // =====================================================
    // UPDATE INTERVIEW STATUS
    // =====================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {

        return ResponseEntity.ok(
                interviewService.updateInterviewStatus(
                        id,
                        request.getStatus()));
    }


    // =====================================================
    // UPDATE ATTENDANCE
    // =====================================================

    @PutMapping("/{id}/attendance")
    public ResponseEntity<?> updateAttendance(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {

        return ResponseEntity.ok(
                interviewService.updateAttendance(
                        id,
                        request.getStatus()));
    }


    // =====================================================
    // UPDATE RESULT
    // =====================================================

    @PutMapping("/{id}/result")
    public ResponseEntity<?> updateResult(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {

        return ResponseEntity.ok(
                interviewService.updateResult(
                        id,
                        request.getStatus()));
    }


    // =====================================================
    // RESCHEDULE INTERVIEW
    // =====================================================

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<?> rescheduleInterview(
            @PathVariable Long id,
            @RequestBody InterviewRequest request) {

        return ResponseEntity.ok(
                interviewService.rescheduleInterview(
                        id,
                        request));
    }
}