import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Interviews() {

    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [filteredInterviews, setFilteredInterviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");


    // =====================================================
    // LOAD INTERVIEWS
    // =====================================================

    useEffect(() => {
        loadInterviews();
    }, []);


    const loadInterviews = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await axios.get(
                "http://localhost:8085/api/interviews/my-interviews",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("My Interviews:", response.data);

            setInterviews(response.data);
            setFilteredInterviews(response.data);

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
                    "Unable to load your interviews."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    useEffect(() => {

        let result = [...interviews];

        // Search
        if (search.trim() !== "") {

            const searchText =
                search.toLowerCase();

            result = result.filter(interview =>

                (interview.jobTitle || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (interview.company || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (interview.interviewerName || "")
                    .toLowerCase()
                    .includes(searchText)
            );
        }


        // Status filter
        if (statusFilter !== "ALL") {

            result = result.filter(
                interview =>
                    interview.status === statusFilter
            );
        }


        setFilteredInterviews(result);

    }, [search, statusFilter, interviews]);


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

        const d = new Date(date);

        return d.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // =====================================================
    // TIME FORMAT
    // =====================================================

    const formatTime = (time) => {

        if (!time) {
            return "-";
        }

        const parts = time.split(":");

        const hour = parseInt(parts[0]);
        const minute = parts[1];

        const period =
            hour >= 12 ? "PM" : "AM";

        const formattedHour =
            hour % 12 || 12;

        return `${formattedHour}:${minute} ${period}`;
    };


    // =====================================================
    // STATUS
    // =====================================================

    const getStatusStyle = (status) => {

        switch (status) {

            case "COMPLETED":

                return {
                    ...styles.status,
                    backgroundColor: "#dcfce7",
                    color: "#15803d"
                };

            case "RESCHEDULED":

                return {
                    ...styles.status,
                    backgroundColor: "#fef3c7",
                    color: "#92400e"
                };

            case "CANCELLED":

                return {
                    ...styles.status,
                    backgroundColor: "#fee2e2",
                    color: "#b91c1c"
                };

            default:

                return {
                    ...styles.status,
                    backgroundColor: "#dbeafe",
                    color: "#1d4ed8"
                };
        }
    };


    // =====================================================
    // RESULT STYLE
    // =====================================================

    const getResultStyle = (result) => {

        if (result === "PASSED") {

            return {
                color: "#15803d",
                fontWeight: "700"
            };
        }

        if (result === "FAILED") {

            return {
                color: "#dc2626",
                fontWeight: "700"
            };
        }

        return {
            color: "#64748b"
        };
    };


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalInterviews =
        interviews.length;

    const scheduledInterviews =
        interviews.filter(
            interview =>
                interview.status === "SCHEDULED"
        ).length;

    const completedInterviews =
        interviews.filter(
            interview =>
                interview.status === "COMPLETED"
        ).length;

    const passedInterviews =
        interviews.filter(
            interview =>
                interview.result === "PASSED"
        ).length;


    // =====================================================
    // UI
    // =====================================================

    return (

        <div style={styles.container}>

            {/* =================================================
                HEADER
            ================================================= */}

            <header style={styles.header}>

                <div style={styles.logoArea}>

                    <div style={styles.logoIcon}>
                        RP
                    </div>

                    <div>

                        <h2 style={styles.logo}>
                            Recruitment Portal
                        </h2>

                        <span style={styles.logoSub}>
                            Candidate Portal
                        </span>

                    </div>

                </div>


                <div style={styles.headerActions}>

                    <button
                        style={styles.headerButton}
                        onClick={() =>
                            navigate(
                                "/candidate-dashboard"
                            )
                        }
                    >
                        🏠 Dashboard
                    </button>


                    <button
                        style={styles.profileButton}
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        👤
                    </button>


                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =================================================
                PAGE
            ================================================= */}

            <main style={styles.main}>

                {/* PAGE HEADER */}

                <div style={styles.pageHeader}>

                    <div>

                        <div style={styles.breadcrumb}>
                            Candidate / Interviews
                        </div>

                        <h1 style={styles.pageTitle}>
                            My Interviews
                        </h1>

                        <p style={styles.subtitle}>
                            Manage your scheduled interviews,
                            meeting details and interview results.
                        </p>

                    </div>


                    <button
                        style={styles.findJobsButton}
                        onClick={() =>
                            navigate("/jobs")
                        }
                    >
                        🔎 Find Jobs
                    </button>

                </div>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                {!loading && !error && (

                    <div style={styles.statsGrid}>

                        <div style={styles.statCard}>

                            <div style={styles.statIcon}>
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

                            <div style={styles.statIconBlue}>
                                ⏰
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

                            <div style={styles.statIconGreen}>
                                ✓
                            </div>

                            <div>

                                <span style={styles.statLabel}>
                                    Completed
                                </span>

                                <strong style={styles.statNumber}>
                                    {completedInterviews}
                                </strong>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div style={styles.statIconPurple}>
                                🎉
                            </div>

                            <div>

                                <span style={styles.statLabel}>
                                    Passed
                                </span>

                                <strong style={styles.statNumber}>
                                    {passedInterviews}
                                </strong>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    SEARCH
                ================================================= */}

                {!loading && interviews.length > 0 && (

                    <div style={styles.searchPanel}>

                        <div style={styles.searchBox}>

                            <span style={styles.searchIcon}>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search by job, company or interviewer..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                style={styles.searchInput}
                            />

                            {search && (

                                <button
                                    style={styles.clearButton}
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    ✕
                                </button>

                            )}

                        </div>


                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                            style={styles.filterSelect}
                        >

                            <option value="ALL">
                                All Status
                            </option>

                            <option value="SCHEDULED">
                                Scheduled
                            </option>

                            <option value="RESCHEDULED">
                                Rescheduled
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>

                        </select>

                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div style={styles.error}>
                        ⚠️ {error}
                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div style={styles.loadingCard}>

                        <div style={styles.spinner}>
                            ⟳
                        </div>

                        <h3>
                            Loading interviews...
                        </h3>

                        <p>
                            Please wait while we fetch your
                            interview details.
                        </p>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    !error &&
                    interviews.length === 0 && (

                        <div style={styles.emptyCard}>

                            <div style={styles.emptyIcon}>
                                📅
                            </div>

                            <h2>
                                No Interviews Yet
                            </h2>

                            <p>
                                You don't have any scheduled
                                interviews at the moment.
                            </p>

                            <button
                                style={
                                    styles.emptyButton
                                }
                                onClick={() =>
                                    navigate("/jobs")
                                }
                            >
                                🔎 Explore Jobs
                            </button>

                        </div>

                    )}


                {/* =================================================
                    NO SEARCH RESULTS
                ================================================= */}

                {!loading &&
                    !error &&
                    interviews.length > 0 &&
                    filteredInterviews.length === 0 && (

                        <div style={styles.emptyCard}>

                            <div style={styles.emptyIcon}>
                                🔍
                            </div>

                            <h2>
                                No Interviews Found
                            </h2>

                            <p>
                                Try changing your search or
                                status filter.
                            </p>

                            <button
                                style={
                                    styles.emptyButton
                                }
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("ALL");
                                }}
                            >
                                Clear Filters
                            </button>

                        </div>

                    )}


                {/* =================================================
                    INTERVIEW LIST
                ================================================= */}

                {!loading &&
                    !error &&
                    filteredInterviews.length > 0 && (

                        <div>

                            <div style={styles.resultHeader}>

                                <strong>
                                    Your Interviews
                                </strong>

                                <span>
                                    {filteredInterviews.length}{" "}
                                    result
                                    {filteredInterviews.length !== 1
                                        ? "s"
                                        : ""}
                                </span>

                            </div>


                            {filteredInterviews.map(
                                (interview) => (

                                    <div
                                        key={
                                            interview.interviewId ||
                                            interview.id
                                        }
                                        style={styles.card}
                                    >

                                        {/* TOP */}

                                        <div style={styles.cardTop}>

                                            <div
                                                style={
                                                    styles.jobSection
                                                }
                                            >

                                                <div
                                                    style={
                                                        styles.companyIcon
                                                    }
                                                >
                                                    🏢
                                                </div>

                                                <div>

                                                    <h2
                                                        style={
                                                            styles.jobTitle
                                                        }
                                                    >
                                                        {
                                                            interview.jobTitle ||
                                                            "Interview"
                                                        }
                                                    </h2>

                                                    <p
                                                        style={
                                                            styles.company
                                                        }
                                                    >
                                                        {
                                                            interview.company ||
                                                            "Company"
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            <span
                                                style={
                                                    getStatusStyle(
                                                        interview.status
                                                    )
                                                }
                                            >
                                                {interview.status ||
                                                    "SCHEDULED"}
                                            </span>

                                        </div>


                                        {/* DETAILS */}

                                        <div
                                            style={
                                                styles.detailsGrid
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.detailBox
                                                }
                                            >

                                                <span
                                                    style={
                                                        styles.detailLabel
                                                    }
                                                >
                                                    DATE
                                                </span>

                                                <strong>
                                                    📅{" "}
                                                    {
                                                        formatDate(
                                                            interview.interviewDate
                                                        )
                                                    }
                                                </strong>

                                            </div>


                                            <div
                                                style={
                                                    styles.detailBox
                                                }
                                            >

                                                <span
                                                    style={
                                                        styles.detailLabel
                                                    }
                                                >
                                                    TIME
                                                </span>

                                                <strong>
                                                    🕐{" "}
                                                    {
                                                        formatTime(
                                                            interview.interviewTime
                                                        )
                                                    }
                                                </strong>

                                            </div>


                                            <div
                                                style={
                                                    styles.detailBox
                                                }
                                            >

                                                <span
                                                    style={
                                                        styles.detailLabel
                                                    }
                                                >
                                                    INTERVIEWER
                                                </span>

                                                <strong>
                                                    👤{" "}
                                                    {
                                                        interview.interviewerName ||
                                                        "-"
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* APPLICATION */}

                                        <div
                                            style={
                                                styles.applicationInfo
                                            }
                                        >

                                            <div>

                                                <span>
                                                    Application ID
                                                </span>

                                                <strong>
                                                    #
                                                    {
                                                        interview.applicationId ||
                                                        "-"
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Application Status
                                                </span>

                                                <strong>
                                                    {
                                                        interview.applicationStatus ||
                                                        "-"
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* ATTENDANCE + RESULT */}

                                        <div
                                            style={
                                                styles.bottomGrid
                                            }
                                        >

                                            <div>

                                                <span
                                                    style={
                                                        styles.bottomLabel
                                                    }
                                                >
                                                    Attendance
                                                </span>

                                                <strong
                                                    style={
                                                        interview.attendance ===
                                                        "ATTENDED"
                                                            ? styles.success
                                                            : interview.attendance ===
                                                              "NOT_ATTENDED"
                                                                ? styles.failed
                                                                : styles.pending
                                                    }
                                                >
                                                    {interview.attendance ||
                                                        "Not Updated"}
                                                </strong>

                                            </div>


                                            <div>

                                                <span
                                                    style={
                                                        styles.bottomLabel
                                                    }
                                                >
                                                    Interview Result
                                                </span>

                                                <strong
                                                    style={
                                                        getResultStyle(
                                                            interview.result
                                                        )
                                                    }
                                                >
                                                    {interview.result ||
                                                        "Not Updated"}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* MEETING */}

                                        {interview.meetingLink && (

                                            <div
                                                style={
                                                    styles.meetingSection
                                                }
                                            >

                                                <div>

                                                    <strong>
                                                        🎥 Online Interview
                                                    </strong>

                                                    <p>
                                                        Join the interview
                                                        using the meeting link.
                                                    </p>

                                                </div>


                                                <a
                                                    href={
                                                        interview.meetingLink
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={
                                                        styles.joinButton
                                                    }
                                                >
                                                    Join Interview →
                                                </a>

                                            </div>

                                        )}


                                        {/* RESCHEDULED */}

                                        {interview.status ===
                                            "RESCHEDULED" && (

                                            <div
                                                style={
                                                    styles.rescheduled
                                                }
                                            >
                                                🔔 Your interview has
                                                been rescheduled. Please
                                                check the updated date
                                                and time above.
                                            </div>

                                        )}


                                        {/* PASSED */}

                                        {interview.result ===
                                            "PASSED" && (

                                            <div
                                                style={
                                                    styles.passedBox
                                                }
                                            >
                                                🎉 Congratulations! You
                                                successfully passed the
                                                interview.
                                            </div>

                                        )}


                                        {/* FAILED */}

                                        {interview.result ===
                                            "FAILED" && (

                                            <div
                                                style={
                                                    styles.failedBox
                                                }
                                            >
                                                Thank you for attending
                                                the interview. We wish
                                                you success in your
                                                future career.
                                            </div>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

            </main>

        </div>
    );
}


// =====================================================
// PROFESSIONAL STYLES
// =====================================================

const styles = {

    container: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        fontFamily:
            "Inter, Arial, sans-serif",
        color: "#0f172a"
    },


    // HEADER

    header: {
        minHeight: "72px",
        background:
            "linear-gradient(135deg, #0f172a, #1e3a8a)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 5%",
        boxShadow:
            "0 5px 20px rgba(15,23,42,0.15)"
    },


    logoArea: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    logoIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "12px",
        background:
            "linear-gradient(135deg,#3b82f6,#6366f1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold"
    },


    logo: {
        margin: 0,
        fontSize: "19px"
    },


    logoSub: {
        fontSize: "11px",
        color: "#cbd5e1"
    },


    headerActions: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },


    headerButton: {
        background: "rgba(255,255,255,0.1)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.2)",
        padding: "10px 15px",
        borderRadius: "9px",
        cursor: "pointer"
    },


    profileButton: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "none",
        background: "#3b82f6",
        color: "white",
        cursor: "pointer",
        fontSize: "17px"
    },


    logoutButton: {
        background: "#ef4444",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // MAIN

    main: {
        maxWidth: "1250px",
        margin: "auto",
        padding: "35px 5%"
    },


    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        gap: "20px"
    },


    breadcrumb: {
        color: "#64748b",
        fontSize: "13px",
        marginBottom: "8px"
    },


    pageTitle: {
        fontSize: "36px",
        margin: "0 0 8px",
        fontWeight: "800"
    },


    subtitle: {
        color: "#64748b",
        margin: 0
    },


    findJobsButton: {
        background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",
        color: "white",
        border: "none",
        padding: "13px 20px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "700",
        boxShadow:
            "0 8px 20px rgba(37,99,235,0.25)"
    },


    // STATS

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
        gap: "18px",
        marginBottom: "25px"
    },


    statCard: {
        background: "rgba(255,255,255,0.9)",
        padding: "22px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow:
            "0 8px 25px rgba(15,23,42,0.07)",
        border:
            "1px solid rgba(226,232,240,0.8)"
    },


    statIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "#ede9fe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },


    statIconBlue: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "#dbeafe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },


    statIconGreen: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "#dcfce7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },


    statIconPurple: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "#f3e8ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },


    statLabel: {
        display: "block",
        color: "#64748b",
        fontSize: "13px",
        marginBottom: "5px"
    },


    statNumber: {
        display: "block",
        fontSize: "25px"
    },


    // SEARCH

    searchPanel: {
        background: "white",
        padding: "16px",
        borderRadius: "15px",
        display: "flex",
        gap: "12px",
        marginBottom: "25px",
        boxShadow:
            "0 5px 20px rgba(15,23,42,0.06)"
    },


    searchBox: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        border:
            "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "0 12px"
    },


    searchIcon: {
        marginRight: "8px"
    },


    searchInput: {
        flex: 1,
        border: "none",
        outline: "none",
        padding: "12px 5px",
        fontSize: "14px"
    },


    clearButton: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: "#64748b"
    },


    filterSelect: {
        border:
            "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "0 15px",
        outline: "none",
        background: "white",
        cursor: "pointer"
    },


    // RESULT

    resultHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px",
        color: "#475569"
    },


    // CARD

    card: {
        background: "rgba(255,255,255,0.95)",
        padding: "28px",
        borderRadius: "18px",
        marginBottom: "20px",
        boxShadow:
            "0 10px 30px rgba(15,23,42,0.07)",
        border:
            "1px solid #e2e8f0"
    },


    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px"
    },


    jobSection: {
        display: "flex",
        alignItems: "center",
        gap: "15px"
    },


    companyIcon: {
        width: "50px",
        height: "50px",
        borderRadius: "13px",
        background: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "23px"
    },


    jobTitle: {
        margin: 0,
        fontSize: "21px"
    },


    company: {
        color: "#64748b",
        margin: "6px 0 0"
    },


    status: {
        padding: "8px 14px",
        borderRadius: "30px",
        fontSize: "12px",
        fontWeight: "700"
    },


    detailsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
        gap: "15px",
        marginTop: "25px",
        paddingTop: "22px",
        borderTop:
            "1px solid #e2e8f0"
    },


    detailBox: {
        background: "#f8fafc",
        padding: "16px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "7px"
    },


    detailLabel: {
        fontSize: "10px",
        color: "#94a3b8",
        fontWeight: "700",
        letterSpacing: "0.5px"
    },


    applicationInfo: {
        display: "flex",
        gap: "50px",
        marginTop: "18px",
        padding: "15px",
        background: "#f8fafc",
        borderRadius: "10px",
        flexWrap: "wrap"
    },


    applicationInfo: {
        display: "flex",
        gap: "50px",
        marginTop: "18px",
        padding: "15px",
        background: "#f8fafc",
        borderRadius: "10px",
        flexWrap: "wrap"
    },


    bottomGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2,1fr)",
        gap: "20px",
        marginTop: "20px"
    },


    bottomGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2,1fr)",
        gap: "20px",
        marginTop: "20px"
    },


    bottomLabel: {
        display: "block",
        fontSize: "12px",
        color: "#64748b",
        marginBottom: "5px"
    },


    success: {
        color: "#15803d"
    },


    failed: {
        color: "#dc2626"
    },


    pending: {
        color: "#d97706"
    },


    meetingSection: {
        marginTop: "22px",
        padding: "18px",
        borderRadius: "12px",
        background:
            "linear-gradient(135deg,#eef2ff,#f5f3ff)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px"
    },


    joinButton: {
        background:
            "linear-gradient(135deg,#7c3aed,#6366f1)",
        color: "white",
        textDecoration: "none",
        padding: "11px 18px",
        borderRadius: "9px",
        fontWeight: "700",
        whiteSpace: "nowrap"
    },


    rescheduled: {
        marginTop: "18px",
        padding: "13px",
        background: "#fffbeb",
        color: "#92400e",
        borderRadius: "9px",
        border:
            "1px solid #fde68a"
    },


    passedBox: {
        marginTop: "18px",
        padding: "14px",
        background: "#f0fdf4",
        color: "#15803d",
        borderRadius: "9px",
        fontWeight: "600"
    },


    failedBox: {
        marginTop: "18px",
        padding: "14px",
        background: "#fef2f2",
        color: "#b91c1c",
        borderRadius: "9px"
    },


    // EMPTY / LOADING

    emptyCard: {
        background: "white",
        padding: "70px 30px",
        borderRadius: "18px",
        textAlign: "center",
        boxShadow:
            "0 10px 30px rgba(15,23,42,0.07)"
    },


    emptyIcon: {
        fontSize: "55px",
        marginBottom: "10px"
    },


    emptyButton: {
        marginTop: "20px",
        background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",
        color: "white",
        border: "none",
        padding: "12px 22px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "700"
    },


    loadingCard: {
        background: "white",
        padding: "60px",
        borderRadius: "18px",
        textAlign: "center"
    },


    spinner: {
        fontSize: "35px",
        color: "#2563eb"
    },


    error: {
        background: "#fef2f2",
        color: "#b91c1c",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px"
    }

};


export default Interviews;