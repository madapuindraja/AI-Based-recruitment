package com.recruitment.portal.service;
import com.recruitment.portal.dto.InterviewDashboardResponse;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recruitment.portal.dto.InterviewRequest;
import com.recruitment.portal.dto.InterviewResponse;
import com.recruitment.portal.entity.Application;
import com.recruitment.portal.entity.Interview;
import com.recruitment.portal.repository.ApplicationRepository;
import com.recruitment.portal.repository.InterviewRepository;

@Service
public class InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private EmailService emailService;


    // =====================================================
    // 1. SCHEDULE INTERVIEW
    // =====================================================

    public Interview scheduleInterview(InterviewRequest request) {

        Application application =
                applicationRepository.findById(
                        request.getApplicationId())
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));

        if (interviewRepository.existsByApplication(application)) {
            throw new RuntimeException(
                    "Interview already scheduled for this application.");
        }

        Interview interview = new Interview();

        interview.setApplication(application);
        interview.setInterviewDate(request.getInterviewDate());
        interview.setInterviewTime(request.getInterviewTime());
        interview.setInterviewerName(request.getInterviewerName());
        interview.setMeetingLink(request.getMeetingLink());

        interview.setStatus("SCHEDULED");
        interview.setAttendance(null);
        interview.setResult(null);

        Interview savedInterview =
                interviewRepository.save(interview);


        String body =
                "Dear Candidate,\n\n" +
                "Your interview has been scheduled.\n\n" +

                "Job Title : " +
                application.getJob().getJobTitle() + "\n" +

                "Company : " +
                application.getJob().getCompany() + "\n\n" +

                "Interview Date : " +
                request.getInterviewDate() + "\n" +

                "Interview Time : " +
                request.getInterviewTime() + "\n\n" +

                "Interviewer : " +
                request.getInterviewerName() + "\n\n" +

                "Meeting Link:\n" +
                request.getMeetingLink() + "\n\n" +

                "Please attend the interview on time.\n\n" +

                "Best of Luck!\n\n" +
                "AI Recruitment Team";


        emailService.sendEmail(
                application.getCandidateEmail(),
                "Interview Scheduled",
                body);

        return savedInterview;
    }


    // =====================================================
    // 2. CANDIDATE - MY INTERVIEWS
    // =====================================================

    public List<InterviewResponse> getMyInterviews(String email) {

        List<Interview> interviews =
                interviewRepository
                        .findByApplicationCandidateEmail(email);

        return convertToResponse(interviews);
    }


    // =====================================================
    // 3. RECRUITER - ALL INTERVIEWS
    // =====================================================

    public List<InterviewResponse> getAllInterviews() {

        List<Interview> interviews =
                interviewRepository.findAll();

        return convertToResponse(interviews);
    }


    // =====================================================
    // CONVERT INTERVIEW TO DTO
    // =====================================================

    private List<InterviewResponse> convertToResponse(
            List<Interview> interviews) {

        List<InterviewResponse> response =
                new ArrayList<>();

        for (Interview interview : interviews) {

            InterviewResponse dto =
                    new InterviewResponse();

            Application application =
                    interview.getApplication();


            dto.setInterviewId(
                    interview.getId());

            dto.setApplicationId(
                    application.getId());

            dto.setCandidateEmail(
                    application.getCandidateEmail());

            dto.setJobTitle(
                    application.getJob().getJobTitle());

            dto.setCompany(
                    application.getJob().getCompany());

            dto.setInterviewDate(
                    interview.getInterviewDate());

            dto.setInterviewTime(
                    interview.getInterviewTime());

            dto.setInterviewerName(
                    interview.getInterviewerName());

            dto.setMeetingLink(
                    interview.getMeetingLink());

            dto.setStatus(
                    interview.getStatus());

            dto.setAttendance(
                    interview.getAttendance());

            dto.setResult(
                    interview.getResult());

            dto.setApplicationStatus(
                    application.getStatus());

            response.add(dto);
        }

        return response;
    }


    // =====================================================
    // 4. UPDATE INTERVIEW STATUS
    // =====================================================

    public Interview updateInterviewStatus(
            Long interviewId,
            String status) {

        Interview interview =
                interviewRepository.findById(interviewId)
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        interview.setStatus(status);

        Interview updatedInterview =
                interviewRepository.save(interview);

        Application application =
                interview.getApplication();


        String body =
                "Dear Candidate,\n\n" +
                "Your interview status has been updated.\n\n" +

                "Job Title : " +
                application.getJob().getJobTitle() + "\n" +

                "Company : " +
                application.getJob().getCompany() + "\n\n" +

                "Interview Status : " +
                status + "\n\n" +

                "Regards,\n" +
                "AI Recruitment Team";


        emailService.sendEmail(
                application.getCandidateEmail(),
                "Interview Status Updated",
                body);

        return updatedInterview;
    }


    // =====================================================
    // 5. UPDATE ATTENDANCE
    // =====================================================

    public Interview updateAttendance(
            Long interviewId,
            String attendance) {

        Interview interview =
                interviewRepository.findById(interviewId)
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        Application application =
                interview.getApplication();


        // -------------------------------------------------
        // ATTENDED
        // -------------------------------------------------

        if ("ATTENDED".equalsIgnoreCase(attendance)) {

            interview.setAttendance("ATTENDED");
            interview.setStatus("COMPLETED");

            Interview savedInterview =
                    interviewRepository.save(interview);


            String body =
                    "Dear Candidate,\n\n" +

                    "Your interview attendance has "
                    + "been recorded successfully.\n\n" +

                    "Job Title : " +
                    application.getJob().getJobTitle() + "\n" +

                    "Company : " +
                    application.getJob().getCompany() + "\n\n" +

                    "Attendance : ATTENDED\n\n" +

                    "Your interview result will be "
                    + "updated by the recruiter.\n\n" +

                    "Regards,\n" +
                    "AI Recruitment Team";


            emailService.sendEmail(
                    application.getCandidateEmail(),
                    "Interview Attendance Recorded",
                    body);

            return savedInterview;
        }


        // -------------------------------------------------
        // NOT ATTENDED
        // -------------------------------------------------

        if ("NOT_ATTENDED".equalsIgnoreCase(attendance)) {

            interview.setAttendance("NOT_ATTENDED");
            interview.setStatus("COMPLETED");
            interview.setResult("FAILED");

            application.setStatus("REJECTED");

            applicationRepository.save(application);

            Interview savedInterview =
                    interviewRepository.save(interview);


            String body =
                    "Dear Candidate,\n\n" +

                    "You did not attend the scheduled "
                    + "interview.\n\n" +

                    "Job Title : " +
                    application.getJob().getJobTitle() + "\n" +

                    "Company : " +
                    application.getJob().getCompany() + "\n\n" +

                    "Attendance : NOT ATTENDED\n\n" +

                    "Your application has been rejected "
                    + "because you did not attend the "
                    + "scheduled interview.\n\n" +

                    "Regards,\n" +
                    "AI Recruitment Team";


            emailService.sendEmail(
                    application.getCandidateEmail(),
                    "Interview Result",
                    body);

            return savedInterview;
        }


        throw new RuntimeException(
                "Invalid attendance. Use ATTENDED or NOT_ATTENDED.");
    }


    // =====================================================
    // 6. UPDATE RESULT
    // =====================================================

    public Interview updateResult(
            Long interviewId,
            String result) {

        Interview interview =
                interviewRepository.findById(interviewId)
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        Application application =
                interview.getApplication();


        if (!"ATTENDED".equalsIgnoreCase(
                interview.getAttendance())) {

            throw new RuntimeException(
                    "Interview result can be updated "
                    + "only when candidate attendance is ATTENDED.");
        }


        if (!"COMPLETED".equalsIgnoreCase(
                interview.getStatus())) {

            throw new RuntimeException(
                    "Interview must be COMPLETED "
                    + "before updating the result.");
        }


        // -------------------------------------------------
        // PASSED
        // -------------------------------------------------

        if ("PASSED".equalsIgnoreCase(result)) {

            interview.setResult("PASSED");
            interview.setStatus("COMPLETED");

            application.setStatus("SELECTED");

            applicationRepository.save(application);

            Interview savedInterview =
                    interviewRepository.save(interview);


            String body =
                    "Dear Candidate,\n\n" +

                    "Congratulations!\n\n" +

                    "You have successfully passed "
                    + "the interview.\n\n" +

                    "Job Title : " +
                    application.getJob().getJobTitle() + "\n" +

                    "Company : " +
                    application.getJob().getCompany() + "\n\n" +

                    "Interview Result : PASSED\n\n" +

                    "Your application has been selected.\n\n" +

                    "Our recruitment team will contact "
                    + "you with the next steps.\n\n" +

                    "Regards,\n" +
                    "AI Recruitment Team";


            emailService.sendEmail(
                    application.getCandidateEmail(),
                    "Congratulations - Interview Passed",
                    body);

            return savedInterview;
        }


        // -------------------------------------------------
        // FAILED
        // -------------------------------------------------

        if ("FAILED".equalsIgnoreCase(result)) {

            interview.setResult("FAILED");
            interview.setStatus("COMPLETED");

            application.setStatus("REJECTED");

            applicationRepository.save(application);

            Interview savedInterview =
                    interviewRepository.save(interview);


            String body =
                    "Dear Candidate,\n\n" +

                    "Thank you for attending the interview.\n\n" +

                    "Job Title : " +
                    application.getJob().getJobTitle() + "\n" +

                    "Company : " +
                    application.getJob().getCompany() + "\n\n" +

                    "Interview Result : FAILED\n\n" +

                    "We regret to inform you that your "
                    + "application was not selected "
                    + "for this position.\n\n" +

                    "We appreciate your time and effort "
                    + "and wish you success in your "
                    + "future career.\n\n" +

                    "Regards,\n" +
                    "AI Recruitment Team";


            emailService.sendEmail(
                    application.getCandidateEmail(),
                    "Interview Result",
                    body);

            return savedInterview;
        }


        throw new RuntimeException(
                "Invalid result. Use PASSED or FAILED.");
    }


    // =====================================================
    // 7. RESCHEDULE INTERVIEW
    // =====================================================

    public Interview rescheduleInterview(
            Long interviewId,
            InterviewRequest request) {

        Interview interview =
                interviewRepository.findById(interviewId)
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        Application application =
                interview.getApplication();


        if (request.getInterviewDate() == null) {

            throw new RuntimeException(
                    "Interview date is required.");
        }


        if (request.getInterviewTime() == null) {

            throw new RuntimeException(
                    "Interview time is required.");
        }


        interview.setInterviewDate(
                request.getInterviewDate());

        interview.setInterviewTime(
                request.getInterviewTime());

        interview.setInterviewerName(
                request.getInterviewerName());

        interview.setMeetingLink(
                request.getMeetingLink());

        interview.setStatus("RESCHEDULED");

        interview.setAttendance(null);

        interview.setResult(null);


        Interview savedInterview =
                interviewRepository.save(interview);


        String body =
                "Dear Candidate,\n\n" +

                "Your interview has been rescheduled.\n\n" +

                "Job Title : " +
                application.getJob().getJobTitle() + "\n" +

                "Company : " +
                application.getJob().getCompany() + "\n\n" +

                "New Interview Date : " +
                request.getInterviewDate() + "\n" +

                "New Interview Time : " +
                request.getInterviewTime() + "\n\n" +

                "Interviewer : " +
                request.getInterviewerName() + "\n\n" +

                "Meeting Link:\n" +
                request.getMeetingLink() + "\n\n" +

                "Please attend the interview at the "
                + "new scheduled time.\n\n" +

                "Best of Luck!\n\n" +

                "AI Recruitment Team";


        emailService.sendEmail(
                application.getCandidateEmail(),
                "Interview Rescheduled",
                body);


        return savedInterview;
    }
 // =====================================================
 // 8. RECRUITER - INTERVIEW DASHBOARD
 // =====================================================

 public InterviewDashboardResponse getInterviewDashboard() {

     List<Interview> interviews =
             interviewRepository.findAll();

     InterviewDashboardResponse dashboard =
             new InterviewDashboardResponse();

     long scheduled = 0;
     long rescheduled = 0;
     long completed = 0;

     long attended = 0;
     long notAttended = 0;

     long passed = 0;
     long failed = 0;


     for (Interview interview : interviews) {

         // ---------------------------------------------
         // STATUS
         // ---------------------------------------------

         if ("SCHEDULED".equalsIgnoreCase(
                 interview.getStatus())) {

             scheduled++;

         } else if ("RESCHEDULED".equalsIgnoreCase(
                 interview.getStatus())) {

             rescheduled++;

         } else if ("COMPLETED".equalsIgnoreCase(
                 interview.getStatus())) {

             completed++;
         }


         // ---------------------------------------------
         // ATTENDANCE
         // ---------------------------------------------

         if ("ATTENDED".equalsIgnoreCase(
                 interview.getAttendance())) {

             attended++;

         } else if ("NOT_ATTENDED".equalsIgnoreCase(
                 interview.getAttendance())) {

             notAttended++;
         }


         // ---------------------------------------------
         // RESULT
         // ---------------------------------------------

         if ("PASSED".equalsIgnoreCase(
                 interview.getResult())) {

             passed++;

         } else if ("FAILED".equalsIgnoreCase(
                 interview.getResult())) {

             failed++;
         }
     }


     dashboard.setTotalInterviews(
             interviews.size());

     dashboard.setScheduled(scheduled);

     dashboard.setRescheduled(rescheduled);

     dashboard.setCompleted(completed);

     dashboard.setAttended(attended);

     dashboard.setNotAttended(notAttended);

     dashboard.setPassed(passed);

     dashboard.setFailed(failed);


     return dashboard;
 }
}