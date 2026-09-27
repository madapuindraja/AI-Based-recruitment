package com.recruitment.portal.dto;

public class InterviewDashboardResponse {

    private long totalInterviews;

    private long scheduled;

    private long rescheduled;

    private long completed;

    private long attended;

    private long notAttended;

    private long passed;

    private long failed;


    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public long getTotalInterviews() {
        return totalInterviews;
    }

    public void setTotalInterviews(long totalInterviews) {
        this.totalInterviews = totalInterviews;
    }


    public long getScheduled() {
        return scheduled;
    }

    public void setScheduled(long scheduled) {
        this.scheduled = scheduled;
    }


    public long getRescheduled() {
        return rescheduled;
    }

    public void setRescheduled(long rescheduled) {
        this.rescheduled = rescheduled;
    }


    public long getCompleted() {
        return completed;
    }

    public void setCompleted(long completed) {
        this.completed = completed;
    }


    public long getAttended() {
        return attended;
    }

    public void setAttended(long attended) {
        this.attended = attended;
    }


    public long getNotAttended() {
        return notAttended;
    }

    public void setNotAttended(long notAttended) {
        this.notAttended = notAttended;
    }


    public long getPassed() {
        return passed;
    }

    public void setPassed(long passed) {
        this.passed = passed;
    }


    public long getFailed() {
        return failed;
    }

    public void setFailed(long failed) {
        this.failed = failed;
    }
}