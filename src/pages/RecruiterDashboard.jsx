import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RecruiterDashboard() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // LOAD JOBS
    // ==========================================

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await axios.get(
                "http://localhost:8085/api/jobs/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setJobs(response.data);

        } catch (err) {

            console.error(
                "Dashboard jobs error:",
                err
            );

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("role");

                navigate("/login");
            }

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // JOB COUNTS
    // ==========================================

    const totalJobs = jobs.length;

    const activeJobs = jobs.filter(
        job => job.status === "OPEN"
    ).length;

    const closedJobs = jobs.filter(
        job => job.status !== "OPEN"
    ).length;


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };


    // ==========================================
    // NAVIGATION
    // ==========================================

    const goTo = (path) => {
        navigate(path);
    };


    return (

        <div style={styles.container}>

            {/* =================================================
                HEADER
            ================================================= */}

            <header style={styles.header}>

                <div style={styles.logoSection}>

                    <div style={styles.logo}>
                        RP
                    </div>

                    <div>

                        <h2 style={styles.logoTitle}>
                            Recruitment Portal
                        </h2>

                        <span style={styles.logoSubtitle}>
                            Recruiter Portal
                        </span>

                    </div>

                </div>


                <div style={styles.headerRight}>

                    <div style={styles.welcomeText}>
                        Welcome, Recruiter 👋
                    </div>

                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            <div style={styles.layout}>

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside style={styles.sidebar}>

                    <div style={styles.sidebarHeader}>

                        <div style={styles.recruiterAvatar}>
                            R
                        </div>

                        <div>

                            <div style={styles.recruiterName}>
                                Recruiter
                            </div>

                            <div style={styles.online}>
                                <span style={styles.onlineDot}></span>
                                Online
                            </div>

                        </div>

                    </div>


                    <div style={styles.sidebarTitle}>
                        RECRUITER MENU
                    </div>


                    {/* DASHBOARD */}

                    <button
                        style={styles.activeMenuButton}
                        onClick={() =>
                            goTo("/recruiter-dashboard")
                        }
                    >

                        <span style={styles.menuIcon}>
                            🏠
                        </span>

                        <span>
                            Dashboard
                        </span>

                    </button>


                    {/* JOBS */}

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            goTo("/recruiter-jobs")
                        }
                    >

                        <span style={styles.menuIcon}>
                            💼
                        </span>

                        <span>
                            Manage Jobs
                        </span>

                    </button>


                    {/* APPLICANTS */}

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            goTo("/recruiter-applicants")
                        }
                    >

                        <span style={styles.menuIcon}>
                            👥
                        </span>

                        <span>
                            Applicants
                        </span>

                    </button>


                    {/* INTERVIEWS */}

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            goTo("/recruiter-interviews")
                        }
                    >

                        <span style={styles.menuIcon}>
                            📅
                        </span>

                        <span>
                            Interviews
                        </span>

                    </button>


                    {/* PROFILE */}

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            goTo("/recruiter-profile")
                        }
                    >

                        <span style={styles.menuIcon}>
                            👤
                        </span>

                        <span>
                            Profile
                        </span>

                    </button>


                    {/* SIDEBAR BOTTOM */}

                    <div style={styles.sidebarBottom}>

                        <div style={styles.helpBox}>

                            <div style={styles.helpIcon}>
                                💡
                            </div>

                            <div>

                                <strong>
                                    Need Help?
                                </strong>

                                <p>
                                    Manage your recruitment
                                    easily.
                                </p>

                            </div>

                        </div>

                    </div>

                </aside>


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <main style={styles.main}>

                    {/* PAGE HEADER */}

                    <div style={styles.pageHeader}>

                        <div>

                            <h1 style={styles.pageTitle}>
                                Recruiter Dashboard
                            </h1>

                            <p style={styles.pageSubtitle}>
                                Manage your jobs, applicants and
                                interviews from one place.
                            </p>

                        </div>


                        <button
                            style={styles.addButton}
                            onClick={() =>
                                goTo("/recruiter-jobs")
                            }
                        >
                            <span style={styles.addIcon}>
                                +
                            </span>

                            Add New Job
                        </button>

                    </div>


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    {loading ? (

                        <div style={styles.loading}>
                            <div style={styles.spinner}></div>
                            Loading dashboard...
                        </div>

                    ) : (

                        <div style={styles.statsGrid}>

                            {/* TOTAL JOBS */}

                            <div style={{
                                ...styles.statCard,
                                ...styles.blueCard
                            }}>

                                <div style={styles.statTop}>

                                    <div>

                                        <p style={styles.statTitle}>
                                            Total Jobs
                                        </p>

                                        <h2 style={styles.statNumber}>
                                            {totalJobs}
                                        </h2>

                                    </div>

                                    <div style={{
                                        ...styles.statIcon,
                                        backgroundColor: "#dbeafe"
                                    }}>
                                        💼
                                    </div>

                                </div>

                                <div style={styles.statBottom}>
                                    All job postings
                                </div>

                            </div>


                            {/* ACTIVE JOBS */}

                            <div style={{
                                ...styles.statCard,
                                ...styles.greenCard
                            }}>

                                <div style={styles.statTop}>

                                    <div>

                                        <p style={styles.statTitle}>
                                            Active Jobs
                                        </p>

                                        <h2 style={styles.statNumber}>
                                            {activeJobs}
                                        </h2>

                                    </div>

                                    <div style={{
                                        ...styles.statIcon,
                                        backgroundColor: "#dcfce7"
                                    }}>
                                        🟢
                                    </div>

                                </div>

                                <div style={styles.statBottom}>
                                    Currently accepting applications
                                </div>

                            </div>


                            {/* CLOSED JOBS */}

                            <div style={{
                                ...styles.statCard,
                                ...styles.redCard
                            }}>

                                <div style={styles.statTop}>

                                    <div>

                                        <p style={styles.statTitle}>
                                            Closed Jobs
                                        </p>

                                        <h2 style={styles.statNumber}>
                                            {closedJobs}
                                        </h2>

                                    </div>

                                    <div style={{
                                        ...styles.statIcon,
                                        backgroundColor: "#fee2e2"
                                    }}>
                                        🔴
                                    </div>

                                </div>

                                <div style={styles.statBottom}>
                                    Expired or closed postings
                                </div>

                            </div>


                            {/* APPLICATIONS */}

                            <div style={{
                                ...styles.statCard,
                                ...styles.purpleCard
                            }}>

                                <div style={styles.statTop}>

                                    <div>

                                        <p style={styles.statTitle}>
                                            Applications
                                        </p>

                                        <h2 style={styles.statNumber}>
                                            —
                                        </h2>

                                    </div>

                                    <div style={{
                                        ...styles.statIcon,
                                        backgroundColor: "#ede9fe"
                                    }}>
                                        👥
                                    </div>

                                </div>

                                <div style={styles.statBottom}>
                                    Candidate applications
                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        QUICK ACTIONS
                    ================================================= */}

                    <section style={styles.section}>

                        <div style={styles.sectionHeader}>

                            <div>

                                <h2 style={styles.sectionTitle}>
                                    Quick Actions
                                </h2>

                                <p style={styles.sectionSubtitle}>
                                    Frequently used recruiter actions
                                </p>

                            </div>

                        </div>


                        <div style={styles.quickGrid}>

                            {/* MANAGE JOBS */}

                            <button
                                style={styles.quickCard}
                                onClick={() =>
                                    goTo("/recruiter-jobs")
                                }
                            >

                                <div style={{
                                    ...styles.quickIcon,
                                    backgroundColor: "#dbeafe"
                                }}>
                                    💼
                                </div>

                                <h3>
                                    Manage Jobs
                                </h3>

                                <p>
                                    Create, edit and delete
                                    job postings.
                                </p>

                                <span style={styles.actionLink}>
                                    Manage Jobs →
                                </span>

                            </button>


                            {/* ADD JOB */}

                            <button
                                style={styles.quickCard}
                                onClick={() =>
                                    goTo("/recruiter-jobs")
                                }
                            >

                                <div style={{
                                    ...styles.quickIcon,
                                    backgroundColor: "#dcfce7"
                                }}>
                                    ➕
                                </div>

                                <h3>
                                    Add New Job
                                </h3>

                                <p>
                                    Publish a new job opening
                                    for candidates.
                                </p>

                                <span style={styles.actionLink}>
                                    Create Job →
                                </span>

                            </button>


                            {/* APPLICANTS */}

                            <button
                                style={styles.quickCard}
                                onClick={() =>
                                    goTo("/recruiter-applicants")
                                }
                            >

                                <div style={{
                                    ...styles.quickIcon,
                                    backgroundColor: "#fef3c7"
                                }}>
                                    👥
                                </div>

                                <h3>
                                    Applicants
                                </h3>

                                <p>
                                    Review candidate applications
                                    and resumes.
                                </p>

                                <span style={styles.actionLink}>
                                    View Applicants →
                                </span>

                            </button>


                            {/* INTERVIEWS */}

                            <button
                                style={styles.quickCard}
                                onClick={() =>
                                    goTo("/recruiter-interviews")
                                }
                            >

                                <div style={{
                                    ...styles.quickIcon,
                                    backgroundColor: "#ede9fe"
                                }}>
                                    📅
                                </div>

                                <h3>
                                    Interviews
                                </h3>

                                <p>
                                    Schedule and manage candidate
                                    interviews.
                                </p>

                                <span style={styles.actionLink}>
                                    Manage Interviews →
                                </span>

                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        RECENT JOBS
                    ================================================= */}

                    <section style={styles.section}>

                        <div style={styles.sectionHeader}>

                            <div>

                                <h2 style={styles.sectionTitle}>
                                    Recent Jobs
                                </h2>

                                <p style={styles.sectionSubtitle}>
                                    Your latest job postings
                                </p>

                            </div>


                            <button
                                style={styles.viewAllButton}
                                onClick={() =>
                                    goTo("/recruiter-jobs")
                                }
                            >
                                View All →
                            </button>

                        </div>


                        {jobs.length === 0 ? (

                            <div style={styles.empty}>

                                <div style={styles.emptyIcon}>
                                    💼
                                </div>

                                <h3>
                                    No Jobs Created Yet
                                </h3>

                                <p>
                                    Create your first job posting
                                    to start receiving applications.
                                </p>

                                <button
                                    style={styles.addButton}
                                    onClick={() =>
                                        goTo("/recruiter-jobs")
                                    }
                                >
                                    + Create Job
                                </button>

                            </div>

                        ) : (

                            <div style={styles.jobsList}>

                                {jobs.slice(0, 5).map(job => (

                                    <div
                                        key={job.id}
                                        style={styles.jobRow}
                                    >

                                        <div style={styles.jobLeft}>

                                            <div style={styles.jobIcon}>
                                                💼
                                            </div>

                                            <div>

                                                <h3 style={styles.jobTitle}>
                                                    {job.jobTitle}
                                                </h3>

                                                <p style={styles.company}>
                                                    {job.company}
                                                </p>

                                            </div>

                                        </div>


                                        <div style={styles.jobInfo}>

                                            <span>
                                                📍 {job.location}
                                            </span>

                                            <span>
                                                📅{" "}
                                                {job.applicationDeadline ||
                                                    "No deadline"}
                                            </span>

                                            <span
                                                style={
                                                    job.status === "OPEN"
                                                        ? styles.openStatus
                                                        : styles.closedStatus
                                                }
                                            >
                                                {job.status || "OPEN"}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>

                </main>

            </div>

        </div>
    );
}


// =========================================================
// STYLES
// =========================================================

const styles = {

    container: {
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: "#1e293b"
    },


    // ==========================================
    // HEADER
    // ==========================================

    header: {
        height: "70px",
        background:
            "linear-gradient(135deg, #0f172a, #1e3a8a, #2563eb)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxSizing: "border-box",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.18)"
    },


    logoSection: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    logo: {
        width: "43px",
        height: "43px",
        borderRadius: "11px",
        background:
            "linear-gradient(135deg, #3b82f6, #6366f1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        fontSize: "16px",
        boxShadow:
            "0 5px 15px rgba(59,130,246,0.35)"
    },


    logoTitle: {
        margin: 0,
        fontSize: "19px",
        fontWeight: "700"
    },


    logoSubtitle: {
        fontSize: "12px",
        color: "#cbd5e1"
    },


    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },


    welcomeText: {
        fontSize: "14px",
        color: "#e2e8f0"
    },


    logoutButton: {
        background: "#ef4444",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // ==========================================
    // LAYOUT
    // ==========================================

    layout: {
        display: "flex",
        minHeight: "calc(100vh - 70px)"
    },


    // ==========================================
    // DYNAMIC SIDEBAR
    // ==========================================

    sidebar: {
        width: "245px",
        background:
            "linear-gradient(180deg, #ffffff 0%, #f8faff 55%, #eef4ff 100%)",
        padding: "25px 16px",
        boxSizing: "border-box",
        boxShadow:
            "3px 0 18px rgba(30,64,175,0.08)",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column"
    },


    sidebarHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "5px 10px 25px",
        borderBottom: "1px solid #e2e8f0",
        marginBottom: "25px"
    },


    recruiterAvatar: {
        width: "45px",
        height: "45px",
        borderRadius: "13px",
        background:
            "linear-gradient(135deg, #2563eb, #7c3aed)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "19px",
        fontWeight: "700",
        boxShadow:
            "0 5px 15px rgba(37,99,235,0.25)"
    },


    recruiterName: {
        fontWeight: "700",
        color: "#0f172a",
        fontSize: "14px"
    },


    online: {
        fontSize: "12px",
        color: "#64748b",
        marginTop: "4px",
        display: "flex",
        alignItems: "center",
        gap: "5px"
    },


    onlineDot: {
        width: "7px",
        height: "7px",
        background: "#22c55e",
        borderRadius: "50%",
        display: "inline-block"
    },


    sidebarTitle: {
        fontSize: "10px",
        fontWeight: "800",
        color: "#94a3b8",
        letterSpacing: "1.2px",
        padding: "0 12px",
        marginBottom: "12px"
    },


    menuButton: {
        width: "100%",
        border: "none",
        background: "transparent",
        padding: "13px 14px",
        marginBottom: "7px",
        borderRadius: "10px",
        textAlign: "left",
        fontSize: "15px",
        cursor: "pointer",
        color: "#475569",
        display: "flex",
        alignItems: "center",
        gap: "13px",
        transition: "all 0.2s ease"
    },


    activeMenuButton: {
        width: "100%",
        border: "none",
        background:
            "linear-gradient(135deg, #eff6ff, #dbeafe)",
        color: "#2563eb",
        padding: "13px 14px",
        marginBottom: "7px",
        borderRadius: "10px",
        textAlign: "left",
        fontSize: "15px",
        cursor: "pointer",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        gap: "13px",
        borderLeft: "4px solid #2563eb",
        boxShadow:
            "0 4px 12px rgba(37,99,235,0.10)"
    },


    menuIcon: {
        width: "25px",
        textAlign: "center",
        fontSize: "18px"
    },


    sidebarBottom: {
        marginTop: "auto"
    },


    helpBox: {
        background:
            "linear-gradient(135deg, #eff6ff, #eef2ff)",
        borderRadius: "12px",
        padding: "14px",
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
        border: "1px solid #dbeafe"
    },


    helpIcon: {
        fontSize: "20px"
    },


    // ==========================================
    // MAIN
    // ==========================================

    main: {
        flex: 1,
        padding: "38px",
        boxSizing: "border-box",
        overflow: "hidden"
    },


    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
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
        fontSize: "15px"
    },


    addButton: {
        background:
            "linear-gradient(135deg, #2563eb, #4f46e5)",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "9px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "700",
        boxShadow:
            "0 5px 15px rgba(37,99,235,0.22)",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },


    addIcon: {
        fontSize: "20px",
        lineHeight: 1
    },


    // ==========================================
    // STATISTICS
    // ==========================================

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
        gap: "20px"
    },


    statCard: {
        background: "white",
        padding: "22px",
        borderRadius: "14px",
        boxShadow:
            "0 5px 20px rgba(15,23,42,0.06)",
        borderTop: "4px solid transparent"
    },


    blueCard: {
        borderTopColor: "#2563eb"
    },


    greenCard: {
        borderTopColor: "#16a34a"
    },


    redCard: {
        borderTopColor: "#dc2626"
    },


    purpleCard: {
        borderTopColor: "#7c3aed"
    },


    statTop: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },


    statTitle: {
        margin: 0,
        color: "#64748b",
        fontSize: "13px",
        fontWeight: "600"
    },


    statNumber: {
        margin: "7px 0 0",
        fontSize: "30px",
        color: "#0f172a"
    },


    statIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },


    statBottom: {
        marginTop: "15px",
        paddingTop: "12px",
        borderTop: "1px solid #f1f5f9",
        color: "#94a3b8",
        fontSize: "12px"
    },


    // ==========================================
    // SECTIONS
    // ==========================================

    section: {
        marginTop: "38px"
    },


    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "18px"
    },


    sectionTitle: {
        margin: 0,
        fontSize: "20px",
        color: "#0f172a"
    },


    sectionSubtitle: {
        margin: "5px 0 0",
        color: "#64748b",
        fontSize: "13px"
    },


    viewAllButton: {
        border: "none",
        background: "transparent",
        color: "#2563eb",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "14px"
    },


    // ==========================================
    // QUICK ACTIONS
    // ==========================================

    quickGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
        gap: "20px"
    },


    quickCard: {
        background: "white",
        border: "1px solid #e2e8f0",
        padding: "22px",
        borderRadius: "14px",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.04)",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        minHeight: "185px",
        transition: "all 0.2s ease"
    },


    quickIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "23px",
        marginBottom: "14px"
    },


    actionLink: {
        marginTop: "auto",
        color: "#2563eb",
        fontSize: "13px",
        fontWeight: "700"
    },


    // ==========================================
    // RECENT JOBS
    // ==========================================

    jobsList: {
        background: "white",
        borderRadius: "14px",
        boxShadow:
            "0 4px 18px rgba(15,23,42,0.05)",
        overflow: "hidden",
        border: "1px solid #e2e8f0"
    },


    jobRow: {
        padding: "20px 24px",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px"
    },


    jobLeft: {
        display: "flex",
        alignItems: "center",
        gap: "14px"
    },


    jobIcon: {
        width: "44px",
        height: "44px",
        borderRadius: "11px",
        background: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
    },


    jobTitle: {
        margin: 0,
        color: "#0f172a",
        fontSize: "16px"
    },


    company: {
        margin: "5px 0 0",
        color: "#64748b",
        fontSize: "13px"
    },


    jobInfo: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
        color: "#64748b",
        fontSize: "13px",
        flexWrap: "wrap",
        justifyContent: "flex-end"
    },


    openStatus: {
        background: "#dcfce7",
        color: "#15803d",
        padding: "6px 12px",
        borderRadius: "20px",
        fontWeight: "700",
        fontSize: "12px"
    },


    closedStatus: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "6px 12px",
        borderRadius: "20px",
        fontWeight: "700",
        fontSize: "12px"
    },


    // ==========================================
    // EMPTY
    // ==========================================

    empty: {
        background: "white",
        padding: "60px 30px",
        borderRadius: "14px",
        textAlign: "center",
        boxShadow:
            "0 4px 18px rgba(15,23,42,0.05)",
        border: "1px solid #e2e8f0"
    },


    emptyIcon: {
        width: "70px",
        height: "70px",
        margin: "0 auto 15px",
        borderRadius: "20px",
        background: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px"
    },


    // ==========================================
    // LOADING
    // ==========================================

    loading: {
        background: "white",
        padding: "50px",
        borderRadius: "14px",
        textAlign: "center",
        color: "#64748b"
    },


    spinner: {
        width: "32px",
        height: "32px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #2563eb",
        borderRadius: "50%",
        margin: "0 auto 15px"
    }

};

export default RecruiterDashboard;