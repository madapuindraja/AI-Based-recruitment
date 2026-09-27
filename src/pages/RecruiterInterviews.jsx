import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RecruiterInterviews() {

    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [updatingId, setUpdatingId] = useState(null);

    const [showRescheduleModal, setShowRescheduleModal] =
        useState(false);

    const [selectedInterview, setSelectedInterview] =
        useState(null);

    const [rescheduleForm, setRescheduleForm] = useState({
        interviewDate: "",
        interviewTime: "",
        interviewerName: "",
        meetingLink: ""
    });


    // =====================================================
    // LOAD INTERVIEWS
    // =====================================================

    useEffect(() => {
        loadInterviews();
    }, []);


    const loadInterviews = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await axios.get(
                "http://localhost:8085/api/interviews/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Interviews:", response.data);

            setInterviews(response.data || []);

        } catch (err) {

            console.error("Interview error:", err);

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("role");

                navigate("/login");

            } else {

                setError(
                    err.response?.data ||
                    "Unable to load interviews."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // COUNTS
    // =====================================================

    const totalInterviews = interviews.length;

    const scheduledInterviews = interviews.filter(
        interview =>
            interview.status === "SCHEDULED"
    ).length;

    const rescheduledInterviews = interviews.filter(
        interview =>
            interview.status === "RESCHEDULED"
    ).length;

    const completedInterviews = interviews.filter(
        interview =>
            interview.status === "COMPLETED"
    ).length;

    const passedInterviews = interviews.filter(
        interview =>
            interview.result === "PASSED"
    ).length;


    // =====================================================
    // ATTENDANCE
    // =====================================================

    const updateAttendance = async (
        interviewId,
        attendance
    ) => {

        const confirmed = window.confirm(
            attendance === "ATTENDED"
                ? "Mark this candidate as ATTENDED?"
                : "Mark this candidate as NOT ATTENDED?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            setUpdatingId(interviewId);

            await axios.put(
                `http://localhost:8085/api/interviews/${interviewId}/attendance`,
                {
                    status: attendance
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await loadInterviews();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data ||
                "Unable to update attendance."
            );

        } finally {

            setUpdatingId(null);

        }
    };


    // =====================================================
    // RESULT
    // =====================================================

    const updateResult = async (
        interviewId,
        result
    ) => {

        const confirmed = window.confirm(
            result === "PASSED"
                ? "Mark this candidate as PASSED?"
                : "Mark this candidate as FAILED?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            setUpdatingId(interviewId);

            await axios.put(
                `http://localhost:8085/api/interviews/${interviewId}/result`,
                {
                    status: result
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await loadInterviews();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data ||
                "Unable to update interview result."
            );

        } finally {

            setUpdatingId(null);

        }
    };


    // =====================================================
    // OPEN RESCHEDULE
    // =====================================================

    const openRescheduleModal = (interview) => {

        setSelectedInterview(interview);

        setRescheduleForm({

            interviewDate:
                interview.interviewDate || "",

            interviewTime:
                interview.interviewTime
                    ? interview.interviewTime.substring(0, 5)
                    : "",

            interviewerName:
                interview.interviewerName || "",

            meetingLink:
                interview.meetingLink || ""

        });

        setShowRescheduleModal(true);
    };


    // =====================================================
    // CLOSE RESCHEDULE
    // =====================================================

    const closeRescheduleModal = () => {

        setShowRescheduleModal(false);

        setSelectedInterview(null);

        setRescheduleForm({
            interviewDate: "",
            interviewTime: "",
            interviewerName: "",
            meetingLink: ""
        });
    };


    // =====================================================
    // RESCHEDULE INPUT
    // =====================================================

    const handleRescheduleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setRescheduleForm(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // =====================================================
    // RESCHEDULE
    // =====================================================

    const rescheduleInterview = async (e) => {

        e.preventDefault();

        if (!selectedInterview) {
            return;
        }

        if (
            !rescheduleForm.interviewDate ||
            !rescheduleForm.interviewTime ||
            !rescheduleForm.interviewerName.trim() ||
            !rescheduleForm.meetingLink.trim()
        ) {

            alert("Please fill all fields.");

            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            setUpdatingId(
                selectedInterview.interviewId
            );

            await axios.put(

                `http://localhost:8085/api/interviews/${selectedInterview.interviewId}/reschedule`,

                {
                    interviewDate:
                        rescheduleForm.interviewDate,

                    interviewTime:
                        rescheduleForm.interviewTime,

                    interviewerName:
                        rescheduleForm.interviewerName,

                    meetingLink:
                        rescheduleForm.meetingLink
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );

            closeRescheduleModal();

            await loadInterviews();

            alert(
                "Interview rescheduled successfully."
            );

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to reschedule interview."
            );

        } finally {

            setUpdatingId(null);

        }
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };


    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (status) => {

        switch (status) {

            case "COMPLETED":
                return styles.completedStatus;

            case "RESCHEDULED":
                return styles.rescheduledStatus;

            case "SCHEDULED":
            default:
                return styles.scheduledStatus;
        }
    };


    // =====================================================
    // ATTENDANCE STYLE
    // =====================================================

    const getAttendanceStyle = (attendance) => {

        if (attendance === "ATTENDED") {
            return styles.attendedStatus;
        }

        if (attendance === "NOT_ATTENDED") {
            return styles.notAttendedStatus;
        }

        return styles.pendingStatus;
    };


    // =====================================================
    // RESULT STYLE
    // =====================================================

    const getResultStyle = (result) => {

        if (result === "PASSED") {
            return styles.passedStatus;
        }

        if (result === "FAILED") {
            return styles.failedStatus;
        }

        return styles.pendingStatus;
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div style={styles.container}>

            {/* =================================================
                HEADER
            ================================================= */}

            <header style={styles.header}>

                <div style={styles.brand}>

                    <div style={styles.logo}>
                        RP
                    </div>

                    <div>

                        <div style={styles.brandTitle}>
                            Recruitment Portal
                        </div>

                        <div style={styles.brandSubtitle}>
                            Recruiter Workspace
                        </div>

                    </div>

                </div>


                <div style={styles.headerRight}>

                    <div style={styles.profileCircle}>
                        R
                    </div>

                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =================================================
                LAYOUT
            ================================================= */}

            <div style={styles.layout}>

                {/* SIDEBAR */}

                <aside style={styles.sidebar}>

                    <div style={styles.sidebarLabel}>
                        RECRUITER
                    </div>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-dashboard"
                            )
                        }
                    >
                        🏠 Dashboard
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-jobs"
                            )
                        }
                    >
                        💼 Jobs
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-applicants"
                            )
                        }
                    >
                        👥 Applicants
                    </button>


                    <button
                        style={styles.activeMenuButton}
                    >
                        📅 Interviews

                        <span style={styles.activeDot}>
                            ●
                        </span>

                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-profile"
                            )
                        }
                    >
                        👤 Profile
                    </button>

                </aside>


                {/* =================================================
                    MAIN
                ================================================= */}

                <main style={styles.main}>

                    {/* PAGE HEADER */}

                    <div style={styles.pageHeader}>

                        <div>

                            <div style={styles.breadcrumb}>
                                Recruiter / Interviews
                            </div>

                            <h1 style={styles.pageTitle}>
                                Interview Management
                            </h1>

                            <p style={styles.pageSubtitle}>
                                Schedule, manage and evaluate
                                candidate interviews.
                            </p>

                        </div>


                        <button
                            style={styles.dashboardButton}
                            onClick={() =>
                                navigate(
                                    "/recruiter-dashboard"
                                )
                            }
                        >
                            ← Dashboard
                        </button>

                    </div>


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    {!loading && (

                        <div style={styles.statsGrid}>

                            <div style={styles.statCard}>

                                <div
                                    style={{
                                        ...styles.statIcon,
                                        background: "#dbeafe"
                                    }}
                                >
                                    📅
                                </div>

                                <div>

                                    <span style={styles.statLabel}>
                                        Total Interviews
                                    </span>

                                    <strong style={styles.statNumber}>
                                        {totalInterviews}
                                    </strong>

                                </div>

                            </div>


                            <div style={styles.statCard}>

                                <div
                                    style={{
                                        ...styles.statIcon,
                                        background: "#dcfce7"
                                    }}
                                >
                                    🟢
                                </div>

                                <div>

                                    <span style={styles.statLabel}>
                                        Scheduled
                                    </span>

                                    <strong style={styles.statNumber}>
                                        {scheduledInterviews}
                                    </strong>

                                </div>

                            </div>


                            <div style={styles.statCard}>

                                <div
                                    style={{
                                        ...styles.statIcon,
                                        background: "#fef3c7"
                                    }}
                                >
                                    🔄
                                </div>

                                <div>

                                    <span style={styles.statLabel}>
                                        Rescheduled
                                    </span>

                                    <strong style={styles.statNumber}>
                                        {rescheduledInterviews}
                                    </strong>

                                </div>

                            </div>


                            <div style={styles.statCard}>

                                <div
                                    style={{
                                        ...styles.statIcon,
                                        background: "#ede9fe"
                                    }}
                                >
                                    🏆
                                </div>

                                <div>

                                    <span style={styles.statLabel}>
                                        Selected
                                    </span>

                                    <strong style={styles.statNumber}>
                                        {passedInterviews}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* ERROR */}

                    {error && (

                        <div style={styles.error}>
                            ⚠️ {error}
                        </div>

                    )}


                    {/* LOADING */}

                    {loading && (

                        <div style={styles.loadingCard}>

                            <div style={styles.spinner}></div>

                            <p>
                                Loading interviews...
                            </p>

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        interviews.length === 0 && (

                            <div style={styles.emptyCard}>

                                <div style={styles.emptyIcon}>
                                    📅
                                </div>

                                <h2>
                                    No interviews yet
                                </h2>

                                <p>
                                    Scheduled candidate
                                    interviews will appear here.
                                </p>

                            </div>

                        )}


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    {!loading &&
                        !error &&
                        interviews.length > 0 && (

                            <div style={styles.tableCard}>

                                <div style={styles.tableHeader}>

                                    <div>

                                        <h2 style={styles.sectionTitle}>
                                            Interview Schedule
                                        </h2>

                                        <p style={styles.sectionSubtitle}>
                                            All candidate interviews
                                        </p>

                                    </div>

                                    <span style={styles.totalBadge}>
                                        {totalInterviews} Interviews
                                    </span>

                                </div>


                                <div style={styles.tableWrapper}>

                                    <table style={styles.table}>

                                        <thead>

                                            <tr>

                                                <th style={styles.th}>
                                                    ID
                                                </th>

                                                <th style={styles.th}>
                                                    Candidate
                                                </th>

                                                <th style={styles.th}>
                                                    Job
                                                </th>

                                                <th style={styles.th}>
                                                    Company
                                                </th>

                                                <th style={styles.th}>
                                                    Date
                                                </th>

                                                <th style={styles.th}>
                                                    Time
                                                </th>

                                                <th style={styles.th}>
                                                    Interviewer
                                                </th>

                                                <th style={styles.th}>
                                                    Status
                                                </th>

                                                <th style={styles.th}>
                                                    Attendance
                                                </th>

                                                <th style={styles.th}>
                                                    Result
                                                </th>

                                                <th style={styles.th}>
                                                    Meeting
                                                </th>

                                                <th style={styles.th}>
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {interviews.map(
                                                (interview) => {

                                                    const isUpdating =
                                                        updatingId ===
                                                        interview.interviewId;

                                                    return (

                                                        <tr
                                                            key={
                                                                interview.interviewId
                                                            }
                                                            style={
                                                                styles.tableRow
                                                            }
                                                        >

                                                            {/* ID */}

                                                            <td style={styles.td}>

                                                                #
                                                                {
                                                                    interview.interviewId
                                                                }

                                                            </td>


                                                            {/* CANDIDATE */}

                                                            <td style={styles.td}>

                                                                <div
                                                                    style={
                                                                        styles.candidateCell
                                                                    }
                                                                >

                                                                    <div
                                                                        style={
                                                                            styles.smallAvatar
                                                                        }
                                                                    >
                                                                        {(
                                                                            interview.candidateEmail ||
                                                                            "C"
                                                                        )
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>

                                                                    <div>

                                                                        <strong>
                                                                            {
                                                                                interview.candidateEmail ||
                                                                                "-"
                                                                            }
                                                                        </strong>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            {/* JOB */}

                                                            <td style={styles.td}>

                                                                <strong>
                                                                    {
                                                                        interview.jobTitle ||
                                                                        "-"
                                                                    }
                                                                </strong>

                                                            </td>


                                                            {/* COMPANY */}

                                                            <td style={styles.td}>

                                                                {
                                                                    interview.company ||
                                                                    "-"
                                                                }

                                                            </td>


                                                            {/* DATE */}

                                                            <td style={styles.td}>

                                                                {
                                                                    formatDate(
                                                                        interview.interviewDate
                                                                    )
                                                                }

                                                            </td>


                                                            {/* TIME */}

                                                            <td style={styles.td}>

                                                                {
                                                                    interview.interviewTime ||
                                                                    "-"
                                                                }

                                                            </td>


                                                            {/* INTERVIEWER */}

                                                            <td style={styles.td}>

                                                                {
                                                                    interview.interviewerName ||
                                                                    "-"
                                                                }

                                                            </td>


                                                            {/* STATUS */}

                                                            <td style={styles.td}>

                                                                <span
                                                                    style={{
                                                                        ...styles.statusBadge,
                                                                        ...getStatusStyle(
                                                                            interview.status
                                                                        )
                                                                    }}
                                                                >
                                                                    {
                                                                        interview.status ||
                                                                        "SCHEDULED"
                                                                    }
                                                                </span>

                                                            </td>


                                                            {/* ATTENDANCE */}

                                                            <td style={styles.td}>

                                                                <span
                                                                    style={{
                                                                        ...styles.statusBadge,
                                                                        ...getAttendanceStyle(
                                                                            interview.attendance
                                                                        )
                                                                    }}
                                                                >
                                                                    {
                                                                        interview.attendance ||
                                                                        "PENDING"
                                                                    }
                                                                </span>

                                                            </td>


                                                            {/* RESULT */}

                                                            <td style={styles.td}>

                                                                <span
                                                                    style={{
                                                                        ...styles.statusBadge,
                                                                        ...getResultStyle(
                                                                            interview.result
                                                                        )
                                                                    }}
                                                                >
                                                                    {
                                                                        interview.result ||
                                                                        "PENDING"
                                                                    }
                                                                </span>

                                                            </td>


                                                            {/* MEETING */}

                                                            <td style={styles.td}>

                                                                {interview.meetingLink ? (

                                                                    <a
                                                                        href={
                                                                            interview.meetingLink
                                                                        }
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        style={
                                                                            styles.meetingButton
                                                                        }
                                                                    >
                                                                        🔗 Open
                                                                    </a>

                                                                ) : (

                                                                    <span>
                                                                        -
                                                                    </span>

                                                                )}

                                                            </td>


                                                            {/* ACTIONS */}

                                                            <td style={styles.td}>

                                                                <div
                                                                    style={
                                                                        styles.actionButtons
                                                                    }
                                                                >

                                                                    <button
                                                                        style={
                                                                            styles.attendedButton
                                                                        }
                                                                        disabled={
                                                                            isUpdating ||
                                                                            !!interview.result
                                                                        }
                                                                        onClick={() =>
                                                                            updateAttendance(
                                                                                interview.interviewId,
                                                                                "ATTENDED"
                                                                            )
                                                                        }
                                                                    >
                                                                        ✓
                                                                    </button>


                                                                    <button
                                                                        style={
                                                                            styles.notAttendedButton
                                                                        }
                                                                        disabled={
                                                                            isUpdating ||
                                                                            !!interview.result
                                                                        }
                                                                        onClick={() =>
                                                                            updateAttendance(
                                                                                interview.interviewId,
                                                                                "NOT_ATTENDED"
                                                                            )
                                                                        }
                                                                    >
                                                                        ✕
                                                                    </button>


                                                                    <button
                                                                        style={
                                                                            styles.rescheduleButton
                                                                        }
                                                                        disabled={
                                                                            isUpdating ||
                                                                            !!interview.result
                                                                        }
                                                                        onClick={() =>
                                                                            openRescheduleModal(
                                                                                interview
                                                                            )
                                                                        }
                                                                    >
                                                                        ↻
                                                                    </button>


                                                                    <button
                                                                        style={
                                                                            styles.passedButton
                                                                        }
                                                                        disabled={
                                                                            isUpdating ||
                                                                            interview.attendance !==
                                                                            "ATTENDED" ||
                                                                            interview.status !==
                                                                            "COMPLETED"
                                                                        }
                                                                        onClick={() =>
                                                                            updateResult(
                                                                                interview.interviewId,
                                                                                "PASSED"
                                                                            )
                                                                        }
                                                                    >
                                                                        🏆
                                                                    </button>


                                                                    <button
                                                                        style={
                                                                            styles.failedButton
                                                                        }
                                                                        disabled={
                                                                            isUpdating ||
                                                                            interview.attendance !==
                                                                            "ATTENDED" ||
                                                                            interview.status !==
                                                                            "COMPLETED"
                                                                        }
                                                                        onClick={() =>
                                                                            updateResult(
                                                                                interview.interviewId,
                                                                                "FAILED"
                                                                            )
                                                                        }
                                                                    >
                                                                        ✕
                                                                    </button>

                                                                </div>

                                                            </td>

                                                        </tr>

                                                    );
                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        )}

                </main>

            </div>


            {/* =================================================
                RESCHEDULE MODAL
            ================================================= */}

            {showRescheduleModal && (

                <div style={styles.modalOverlay}>

                    <div style={styles.modal}>

                        <div style={styles.modalHeader}>

                            <div>

                                <span style={styles.modalEyebrow}>
                                    INTERVIEW MANAGEMENT
                                </span>

                                <h2>
                                    Reschedule Interview
                                </h2>

                            </div>


                            <button
                                style={styles.closeButton}
                                onClick={closeRescheduleModal}
                            >
                                ×
                            </button>

                        </div>


                        <div style={styles.modalCandidate}>

                            <div style={styles.modalAvatar}>
                                👤
                            </div>

                            <div>

                                <span>
                                    Candidate
                                </span>

                                <strong>
                                    {
                                        selectedInterview?.candidateEmail
                                    }
                                </strong>

                            </div>

                        </div>


                        <form
                            onSubmit={
                                rescheduleInterview
                            }
                        >

                            <div style={styles.formGrid}>

                                <div style={styles.formGroup}>

                                    <label>
                                        Interview Date
                                    </label>

                                    <input
                                        type="date"
                                        name="interviewDate"
                                        value={
                                            rescheduleForm.interviewDate
                                        }
                                        onChange={
                                            handleRescheduleChange
                                        }
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        required
                                        style={styles.input}
                                    />

                                </div>


                                <div style={styles.formGroup}>

                                    <label>
                                        Interview Time
                                    </label>

                                    <input
                                        type="time"
                                        name="interviewTime"
                                        value={
                                            rescheduleForm.interviewTime
                                        }
                                        onChange={
                                            handleRescheduleChange
                                        }
                                        required
                                        style={styles.input}
                                    />

                                </div>

                            </div>


                            <div style={styles.formGroup}>

                                <label>
                                    Interviewer Name
                                </label>

                                <input
                                    type="text"
                                    name="interviewerName"
                                    value={
                                        rescheduleForm.interviewerName
                                    }
                                    onChange={
                                        handleRescheduleChange
                                    }
                                    placeholder="Enter interviewer name"
                                    required
                                    style={styles.input}
                                />

                            </div>


                            <div style={styles.formGroup}>

                                <label>
                                    Meeting Link
                                </label>

                                <input
                                    type="url"
                                    name="meetingLink"
                                    value={
                                        rescheduleForm.meetingLink
                                    }
                                    onChange={
                                        handleRescheduleChange
                                    }
                                    placeholder="https://meet.google.com/..."
                                    required
                                    style={styles.input}
                                />

                            </div>


                            <div style={styles.modalActions}>

                                <button
                                    type="button"
                                    style={styles.cancelButton}
                                    onClick={
                                        closeRescheduleModal
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    style={styles.confirmButton}
                                    disabled={
                                        updatingId ===
                                        selectedInterview?.interviewId
                                    }
                                >

                                    {updatingId ===
                                    selectedInterview?.interviewId

                                        ? "Rescheduling..."

                                        : "↻ Reschedule Interview"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}


// =========================================================
// STYLES
// =========================================================

const styles = {

    container: {
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: "#172033"
    },


    // HEADER

    header: {
        height: "70px",
        background:
            "linear-gradient(135deg,#0f172a,#1e3a8a 55%,#312e81)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxSizing: "border-box"
    },

    brand: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },

    logo: {
        width: "42px",
        height: "42px",
        borderRadius: "11px",
        background:
            "linear-gradient(135deg,#3b82f6,#6366f1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800"
    },

    brandTitle: {
        fontSize: "18px",
        fontWeight: "700"
    },

    brandSubtitle: {
        fontSize: "11px",
        color: "#cbd5e1"
    },

    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "14px"
    },

    profileCircle: {
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        background:
            "linear-gradient(135deg,#60a5fa,#8b5cf6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700"
    },

    logoutButton: {
        border: "none",
        background: "#ef4444",
        color: "white",
        padding: "9px 17px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // LAYOUT

    layout: {
        display: "flex",
        minHeight: "calc(100vh - 70px)"
    },


    // SIDEBAR

    sidebar: {
        width: "245px",
        background:
            "linear-gradient(180deg,#111827 0%,#172554 48%,#312e81 100%)",
        padding: "30px 15px",
        boxSizing: "border-box",
        boxShadow:
            "4px 0 20px rgba(15,23,42,0.12)"
    },

    sidebarLabel: {
        color: "#94a3b8",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "1.5px",
        padding: "0 13px",
        marginBottom: "18px"
    },

    menuButton: {
        width: "100%",
        border: "none",
        background: "transparent",
        color: "#cbd5e1",
        padding: "13px 14px",
        marginBottom: "6px",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "14px"
    },

    activeMenuButton: {
        width: "100%",
        border: "1px solid rgba(96,165,250,0.25)",
        background:
            "linear-gradient(90deg,rgba(37,99,235,0.35),rgba(99,102,241,0.22))",
        color: "white",
        padding: "13px 14px",
        marginBottom: "6px",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "14px",
        fontWeight: "700"
    },

    activeDot: {
        float: "right",
        color: "#60a5fa"
    },


    // MAIN

    main: {
        flex: 1,
        padding: "35px",
        boxSizing: "border-box",
        overflow: "hidden"
    },

    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "28px"
    },

    breadcrumb: {
        color: "#64748b",
        fontSize: "12px",
        marginBottom: "8px"
    },

    pageTitle: {
        margin: 0,
        fontSize: "30px",
        fontWeight: "750",
        color: "#0f172a"
    },

    pageSubtitle: {
        marginTop: "7px",
        color: "#64748b",
        fontSize: "14px"
    },

    dashboardButton: {
        background: "white",
        border: "1px solid #e2e8f0",
        color: "#334155",
        padding: "10px 17px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // STATS

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4,minmax(0,1fr))",
        gap: "18px",
        marginBottom: "30px"
    },

    statCard: {
        background: "white",
        borderRadius: "14px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        border: "1px solid #e8edf5",
        boxShadow:
            "0 5px 18px rgba(15,23,42,0.05)"
    },

    statIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "21px"
    },

    statLabel: {
        display: "block",
        color: "#64748b",
        fontSize: "12px",
        marginBottom: "4px"
    },

    statNumber: {
        display: "block",
        fontSize: "24px",
        color: "#0f172a"
    },


    // TABLE

    tableCard: {
        background: "white",
        borderRadius: "16px",
        border: "1px solid #e6eaf1",
        boxShadow:
            "0 7px 25px rgba(15,23,42,0.055)",
        overflow: "hidden"
    },

    tableHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "22px 24px",
        borderBottom: "1px solid #eef2f7"
    },

    sectionTitle: {
        margin: 0,
        fontSize: "19px",
        color: "#0f172a"
    },

    sectionSubtitle: {
        margin: "5px 0 0",
        color: "#64748b",
        fontSize: "13px"
    },

    totalBadge: {
        background: "#eef2ff",
        color: "#4338ca",
        padding: "8px 13px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700"
    },

    tableWrapper: {
        width: "100%",
        overflowX: "auto"
    },

    table: {
        width: "100%",
        minWidth: "1400px",
        borderCollapse: "collapse",
        fontSize: "13px"
    },

    th: {
        background: "#f8fafc",
        color: "#475569",
        fontSize: "11px",
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        padding: "14px 12px",
        textAlign: "left",
        borderBottom: "1px solid #e2e8f0",
        whiteSpace: "nowrap"
    },

    td: {
        padding: "15px 12px",
        borderBottom: "1px solid #eef2f7",
        color: "#475569",
        verticalAlign: "middle",
        whiteSpace: "nowrap"
    },

    tableRow: {
        background: "white"
    },

    candidateCell: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
        maxWidth: "220px"
    },

    smallAvatar: {
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        background:
            "linear-gradient(135deg,#2563eb,#6366f1)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        flexShrink: 0
    },


    // STATUS

    statusBadge: {
        display: "inline-block",
        padding: "6px 9px",
        borderRadius: "15px",
        fontSize: "10px",
        fontWeight: "800"
    },

    scheduledStatus: {
        background: "#dbeafe",
        color: "#1d4ed8"
    },

    rescheduledStatus: {
        background: "#fef3c7",
        color: "#b45309"
    },

    completedStatus: {
        background: "#dcfce7",
        color: "#15803d"
    },

    attendedStatus: {
        background: "#dcfce7",
        color: "#15803d"
    },

    notAttendedStatus: {
        background: "#fee2e2",
        color: "#b91c1c"
    },

    passedStatus: {
        background: "#dcfce7",
        color: "#047857"
    },

    failedStatus: {
        background: "#fee2e2",
        color: "#991b1b"
    },

    pendingStatus: {
        background: "#fef3c7",
        color: "#b45309"
    },


    // MEETING

    meetingButton: {
        display: "inline-block",
        background: "#4f46e5",
        color: "white",
        textDecoration: "none",
        padding: "7px 11px",
        borderRadius: "7px",
        fontSize: "11px",
        fontWeight: "700"
    },


    // ACTIONS

    actionButtons: {
        display: "flex",
        gap: "5px"
    },

    attendedButton: {
        background: "#16a34a",
        color: "white",
        border: "none",
        padding: "7px 9px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "700"
    },

    notAttendedButton: {
        background: "#dc2626",
        color: "white",
        border: "none",
        padding: "7px 9px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "700"
    },

    rescheduleButton: {
        background: "#f59e0b",
        color: "white",
        border: "none",
        padding: "7px 9px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "700"
    },

    passedButton: {
        background: "#047857",
        color: "white",
        border: "none",
        padding: "7px 9px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "700"
    },

    failedButton: {
        background: "#991b1b",
        color: "white",
        border: "none",
        padding: "7px 9px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "700"
    },


    // EMPTY / LOADING

    emptyCard: {
        background: "white",
        padding: "70px 30px",
        textAlign: "center",
        borderRadius: "16px",
        boxShadow:
            "0 5px 20px rgba(15,23,42,0.05)"
    },

    emptyIcon: {
        fontSize: "55px"
    },

    loadingCard: {
        background: "white",
        padding: "50px",
        borderRadius: "16px",
        textAlign: "center"
    },

    spinner: {
        width: "32px",
        height: "32px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #2563eb",
        borderRadius: "50%",
        margin: "0 auto 12px"
    },

    error: {
        background: "#fef2f2",
        color: "#b91c1c",
        padding: "14px",
        borderRadius: "9px",
        marginBottom: "20px"
    },


    // MODAL

    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.62)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px"
    },

    modal: {
        background: "white",
        width: "100%",
        maxWidth: "560px",
        borderRadius: "18px",
        padding: "28px",
        boxShadow:
            "0 25px 70px rgba(0,0,0,0.25)",
        boxSizing: "border-box"
    },

    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "22px"
    },

    modalEyebrow: {
        display: "block",
        color: "#6366f1",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "1px",
        marginBottom: "5px"
    },

    closeButton: {
        width: "34px",
        height: "34px",
        borderRadius: "8px",
        border: "none",
        background: "#f1f5f9",
        color: "#475569",
        fontSize: "22px",
        cursor: "pointer"
    },

    modalCandidate: {
        background:
            "linear-gradient(135deg,#eff6ff,#eef2ff)",
        padding: "14px",
        borderRadius: "11px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "22px"
    },

    modalAvatar: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "#2563eb",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px"
    },

    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "7px",
        marginBottom: "17px"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "11px 12px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        background: "#f8fafc"
    },

    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "15px"
    },

    cancelButton: {
        border: "1px solid #cbd5e1",
        background: "white",
        color: "#475569",
        padding: "11px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },

    confirmButton: {
        border: "none",
        background:
            "linear-gradient(135deg,#f59e0b,#d97706)",
        color: "white",
        padding: "11px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "700"
    }

};

export default RecruiterInterviews;