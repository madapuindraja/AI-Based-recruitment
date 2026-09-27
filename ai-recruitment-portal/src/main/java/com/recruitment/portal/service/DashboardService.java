package com.recruitment.portal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recruitment.portal.dto.DashboardResponse;
import com.recruitment.portal.repository.ApplicationRepository;
import com.recruitment.portal.repository.InterviewRepository;
import com.recruitment.portal.repository.JobRepository;

@Service
public class DashboardService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    public DashboardResponse getDashboard() {

        DashboardResponse response = new DashboardResponse();

        response.setTotalJobs(jobRepository.count());

        response.setTotalApplications(applicationRepository.count());

        response.setTotalInterviews(interviewRepository.count());

        // For now, using interview count as selected candidates.
        // Later we can count only candidates with status = SELECTED.
        response.setSelectedCandidates(interviewRepository.count());

        return response;
    }
}