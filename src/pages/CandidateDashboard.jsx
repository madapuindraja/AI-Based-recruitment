import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CandidateDashboard() {
    const navigate = useNavigate();

    const [jobsCount, setJobsCount] = useState(0);
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // Jobs
            const jobsResponse = await axios.get(
                "http://localhost:8085/api/jobs/all",
                config
            );

            setJobsCount(
                Array.isArray(jobsResponse.data)
                    ? jobsResponse.data.length
                    : 0
            );

            // Applications
            const applicationsResponse = await axios.get(
                "http://localhost:8085/api/applications/my-applications",
                config
            );

            setApplications(
                Array.isArray(applicationsResponse.data)
                    ? applicationsResponse.data
                    : []
            );

            // Interviews
            try {
                const interviewsResponse = await axios.get(
                    "http://localhost:8085/api/interviews/my-interviews",
                    config
                );

                setInterviews(
                    Array.isArray(interviewsResponse.data)
                        ? interviewsResponse.data
                        : []
                );
            } catch (error) {
                console.log("Interview API unavailable");
                setInterviews([]);
            }

        } catch (error) {
            console.error("Dashboard error:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
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
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusClass = (status) => {
        if (status === "SHORTLISTED") {
            return {
                background: "#dcfce7",
                color: "#15803d"
            };
        }

        if (status === "REJECTED") {
            return {
                background: "#fee2e2",
                color: "#b91c1c"
            };
        }

        return {
            background: "#dbeafe",
            color: "#1d4ed8"
        };
    };

    // ==========================================
    // USER INITIAL
    // ==========================================

    const getUserInitial = () => {
        const email = localStorage.getItem("email");

        if (email) {
            return email.charAt(0).toUpperCase();
        }

        return "C";
    };

    return (
        <div style={styles.page}>

            {/* =====================================
                SIDEBAR
            ===================================== */}

            <aside
                style={{
                    ...styles.sidebar,
                    ...(menuOpen ? styles.sidebarMobile : {})
                }}
            >

                <div style={styles.brand}>
                    <div style={styles.logoIcon}>
                        R
                    </div>

                    <div>
                        <div style={styles.brandName}>
                            RecruitPro
                        </div>

                        <div style={styles.brandSub}>
                            Recruitment Portal
                        </div>
                    </div>
                </div>

                <div style={styles.profileMini}>
                    <div style={styles.avatar}>
                        {getUserInitial()}
                    </div>

                    <div>
                        <div style={styles.candidateName}>
                            Candidate
                        </div>

                        <div style={styles.candidateRole}>
                            Job Seeker
                        </div>
                    </div>
                </div>

                <div style={styles.navTitle}>
                    MAIN MENU
                </div>

                <button
                    style={{
                        ...styles.navButton,
                        ...styles.activeNav
                    }}
                    onClick={() => navigate("/candidate-dashboard")}
                >
                    <span>⌂</span>
                    Dashboard
                </button>

                <button
                    style={styles.navButton}
                    onClick={() => navigate("/jobs")}
                >
                    <span>💼</span>
                    Find Jobs
                </button>

                <button
                    style={styles.navButton}
                    onClick={() => navigate("/my-applications")}
                >
                    <span>📄</span>
                    My Applications
                </button>

                <button
                    style={styles.navButton}
                    onClick={() => navigate("/interviews")}
                >
                    <span>📅</span>
                    Interviews
                </button>

                <div style={styles.navTitle}>
                    ACCOUNT
                </div>

                <button
                    style={styles.navButton}
                    onClick={() => navigate("/profile")}
                >
                    <span>👤</span>
                    My Profile
                </button>

                <div style={styles.sidebarBottom}>
                    <button
                        style={styles.logoutSide}
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>
                </div>

            </aside>

            {/* =====================================
                MOBILE OVERLAY
            ===================================== */}

            {menuOpen && (
                <div
                    style={styles.overlay}
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* =====================================
                MAIN AREA
            ===================================== */}

            <div style={styles.mainWrapper}>

                {/* HEADER */}

                <header style={styles.header}>

                    <button
                        style={styles.mobileMenu}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>

                    <div>
                        <div style={styles.headerTitle}>
                            Candidate Dashboard
                        </div>

                        <div style={styles.headerDate}>
                            Manage your career journey
                        </div>
                    </div>

                    <div style={styles.headerRight}>

                        <button
                            style={styles.notification}
                            title="Notifications"
                        >
                            🔔
                            {interviews.length > 0 && (
                                <span style={styles.notificationDot}>
                                    {interviews.length}
                                </span>
                            )}
                        </button>

                        <div style={styles.headerAvatar}>
                            {getUserInitial()}
                        </div>

                    </div>

                </header>

                {/* =====================================
                    CONTENT
                ===================================== */}

                <main style={styles.content}>

                    {/* WELCOME BANNER */}

                    <section style={styles.welcomeBanner}>

                        <div>

                            <div style={styles.welcomeSmall}>
                                WELCOME BACK 👋
                            </div>

                            <h1 style={styles.welcomeTitle}>
                                Ready for your next opportunity?
                            </h1>

                            <p style={styles.welcomeText}>
                                Explore new jobs, track your applications
                                and stay updated with your interviews.
                            </p>

                            <button
                                style={styles.findJobButton}
                                onClick={() => navigate("/jobs")}
                            >
                                Explore Jobs
                                <span style={styles.arrow}>
                                    →
                                </span>
                            </button>

                        </div>

                        <div style={styles.bannerGraphic}>
                            <div style={styles.graphicCircle}>
                                💼
                            </div>
                        </div>

                    </section>

                    {/* =====================================
                        STATISTICS
                    ===================================== */}

                    <div style={styles.statsGrid}>

                        <div
                            style={styles.statCard}
                            onClick={() => navigate("/jobs")}
                        >
                            <div
                                style={{
                                    ...styles.statIcon,
                                    background: "#e0edff"
                                }}
                            >
                                💼
                            </div>

                            <div style={styles.statInfo}>
                                <div style={styles.statLabel}>
                                    Available Jobs
                                </div>

                                <div style={styles.statNumber}>
                                    {loading ? "..." : jobsCount}
                                </div>

                                <div style={styles.statLink}>
                                    Browse opportunities →
                                </div>
                            </div>
                        </div>

                        <div
                            style={styles.statCard}
                            onClick={() =>
                                navigate("/my-applications")
                            }
                        >
                            <div
                                style={{
                                    ...styles.statIcon,
                                    background: "#ede9fe"
                                }}
                            >
                                📄
                            </div>

                            <div style={styles.statInfo}>
                                <div style={styles.statLabel}>
                                    Applications
                                </div>

                                <div style={styles.statNumber}>
                                    {loading
                                        ? "..."
                                        : applications.length}
                                </div>

                                <div style={styles.statLink}>
                                    Track applications →
                                </div>
                            </div>
                        </div>

                        <div
                            style={styles.statCard}
                            onClick={() => navigate("/interviews")}
                        >
                            <div
                                style={{
                                    ...styles.statIcon,
                                    background: "#dcfce7"
                                }}
                            >
                                📅
                            </div>

                            <div style={styles.statInfo}>
                                <div style={styles.statLabel}>
                                    Interviews
                                </div>

                                <div style={styles.statNumber}>
                                    {loading
                                        ? "..."
                                        : interviews.length}
                                </div>

                                <div style={styles.statLink}>
                                    View schedule →
                                </div>
                            </div>
                        </div>

                        <div
                            style={styles.statCard}
                            onClick={() => navigate("/profile")}
                        >
                            <div
                                style={{
                                    ...styles.statIcon,
                                    background: "#fff7ed"
                                }}
                            >
                                👤
                            </div>

                            <div style={styles.statInfo}>
                                <div style={styles.statLabel}>
                                    Profile
                                </div>

                                <div style={styles.profileComplete}>
                                    Active
                                </div>

                                <div style={styles.statLink}>
                                    Manage profile →
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* =====================================
                        TWO COLUMN AREA
                    ===================================== */}

                    <div style={styles.twoColumn}>

                        {/* APPLICATIONS */}

                        <section style={styles.panel}>

                            <div style={styles.panelHeader}>

                                <div>
                                    <h2 style={styles.panelTitle}>
                                        Recent Applications
                                    </h2>

                                    <p style={styles.panelSubtitle}>
                                        Track your latest job applications
                                    </p>
                                </div>

                                <button
                                    style={styles.viewAll}
                                    onClick={() =>
                                        navigate("/my-applications")
                                    }
                                >
                                    View All
                                </button>

                            </div>

                            {loading ? (

                                <div style={styles.loadingBox}>
                                    <div style={styles.spinner}>
                                    </div>

                                    Loading applications...
                                </div>

                            ) : applications.length === 0 ? (

                                <div style={styles.emptyState}>

                                    <div style={styles.emptyIcon}>
                                        📄
                                    </div>

                                    <h3>
                                        No applications yet
                                    </h3>

                                    <p>
                                        Start exploring jobs and apply
                                        for positions that match your skills.
                                    </p>

                                    <button
                                        style={styles.primaryButton}
                                        onClick={() =>
                                            navigate("/jobs")
                                        }
                                    >
                                        Find Jobs
                                    </button>

                                </div>

                            ) : (

                                <div>

                                    {applications
                                        .slice(0, 5)
                                        .map((application) => {

                                            const status =
                                                getStatusClass(
                                                    application.status
                                                );

                                            return (
                                                <div
                                                    key={application.id}
                                                    style={styles.applicationItem}
                                                >

                                                    <div
                                                        style={
                                                            styles.companyIcon
                                                        }
                                                    >
                                                        💼
                                                    </div>

                                                    <div
                                                        style={
                                                            styles.applicationInfo
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                styles.jobTitle
                                                            }
                                                        >
                                                            {application.job?.jobTitle ||
                                                                "Job Position"}
                                                        </div>

                                                        <div
                                                            style={
                                                                styles.companyName
                                                            }
                                                        >
                                                            {application.job?.company ||
                                                                "Company"}
                                                        </div>

                                                    </div>

                                                    <div
                                                        style={{
                                                            ...styles.statusBadge,
                                                            background:
                                                                status.background,
                                                            color:
                                                                status.color
                                                        }}
                                                    >
                                                        {application.status ||
                                                            "APPLIED"}
                                                    </div>

                                                </div>
                                            );
                                        })}

                                </div>
                            )}

                        </section>

                        {/* INTERVIEWS */}

                        <section style={styles.panel}>

                            <div style={styles.panelHeader}>

                                <div>
                                    <h2 style={styles.panelTitle}>
                                        Upcoming Interviews
                                    </h2>

                                    <p style={styles.panelSubtitle}>
                                        Your scheduled interviews
                                    </p>
                                </div>

                                <button
                                    style={styles.viewAll}
                                    onClick={() =>
                                        navigate("/interviews")
                                    }
                                >
                                    View All
                                </button>

                            </div>

                            {loading ? (

                                <div style={styles.loadingBox}>
                                    Loading interviews...
                                </div>

                            ) : interviews.length === 0 ? (

                                <div style={styles.emptyState}>

                                    <div style={styles.emptyIcon}>
                                        📅
                                    </div>

                                    <h3>
                                        No interviews scheduled
                                    </h3>

                                    <p>
                                        Your upcoming interviews will
                                        appear here.
                                    </p>

                                </div>

                            ) : (

                                <div>

                                    {interviews
                                        .slice(0, 3)
                                        .map((interview) => (

                                            <div
                                                key={interview.id}
                                                style={styles.interviewItem}
                                            >

                                                <div
                                                    style={
                                                        styles.calendarIcon
                                                    }
                                                >
                                                    <div>
                                                        📅
                                                    </div>
                                                </div>

                                                <div
                                                    style={
                                                        styles.interviewInfo
                                                    }
                                                >

                                                    <div
                                                        style={
                                                            styles.interviewTitle
                                                        }
                                                    >
                                                        Interview
                                                    </div>

                                                    <div
                                                        style={
                                                            styles.interviewDetail
                                                        }
                                                    >
                                                        📅{" "}
                                                        {interview.interviewDate}
                                                    </div>

                                                    <div
                                                        style={
                                                            styles.interviewDetail
                                                        }
                                                    >
                                                        ⏰{" "}
                                                        {interview.interviewTime}
                                                    </div>

                                                    <div
                                                        style={
                                                            styles.interviewDetail
                                                        }
                                                    >
                                                        👤{" "}
                                                        {interview.interviewerName ||
                                                            "Interviewer"}
                                                    </div>

                                                    {interview.meetingLink && (
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
                                                    )}

                                                </div>

                                            </div>

                                        ))}

                                </div>
                            )}

                        </section>

                    </div>

                    {/* =====================================
                        QUICK ACTIONS
                    ===================================== */}

                    <section style={styles.quickSection}>

                        <div>
                            <h2 style={styles.quickTitle}>
                                Quick Actions
                            </h2>

                            <p style={styles.quickSubtitle}>
                                Everything you need for your job search
                            </p>
                        </div>

                        <div style={styles.quickGrid}>

                            <button
                                style={styles.quickCard}
                                onClick={() => navigate("/jobs")}
                            >
                                <span style={styles.quickIcon}>
                                    🔎
                                </span>

                                <span>
                                    Search Jobs
                                </span>

                                <small>
                                    Find your next role
                                </small>
                            </button>

                            <button
                                style={styles.quickCard}
                                onClick={() =>
                                    navigate("/my-applications")
                                }
                            >
                                <span style={styles.quickIcon}>
                                    📊
                                </span>

                                <span>
                                    Track Applications
                                </span>

                                <small>
                                    Check application status
                                </small>
                            </button>

                            <button
                                style={styles.quickCard}
                                onClick={() =>
                                    navigate("/interviews")
                                }
                            >
                                <span style={styles.quickIcon}>
                                    🗓️
                                </span>

                                <span>
                                    View Interviews
                                </span>

                                <small>
                                    Manage your schedule
                                </small>
                            </button>

                            <button
                                style={styles.quickCard}
                                onClick={() =>
                                    navigate("/profile")
                                }
                            >
                                <span style={styles.quickIcon}>
                                    ⚙️
                                </span>

                                <span>
                                    Update Profile
                                </span>

                                <small>
                                    Keep your profile updated
                                </small>
                            </button>

                        </div>

                    </section>

                </main>

                {/* FOOTER */}

                <footer style={styles.footer}>
                    <span>
                        © 2026 RecruitPro
                    </span>

                    <span>
                        Candidate Portal
                    </span>
                </footer>

            </div>
        </div>
    );
}

// ======================================================
// PROFESSIONAL STYLES
// ======================================================

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily:
            "'Inter', 'Segoe UI', Arial, sans-serif",
        color: "#172033"
    },

    // SIDEBAR

    sidebar: {
        width: "250px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background:
            "linear-gradient(180deg, #111827 0%, #172554 100%)",
        color: "white",
        padding: "24px 16px",
        boxSizing: "border-box",
        zIndex: 100,
        display: "flex",
        flexDirection: "column"
    },

    sidebarMobile: {
        transform: "translateX(0)"
    },

    brand: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "4px 10px 25px",
        borderBottom:
            "1px solid rgba(255,255,255,0.1)"
    },

    logoIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "12px",
        background:
            "linear-gradient(135deg, #3b82f6, #6366f1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        fontSize: "20px"
    },

    brandName: {
        fontWeight: "700",
        fontSize: "18px"
    },

    brandSub: {
        color: "#94a3b8",
        fontSize: "11px",
        marginTop: "2px"
    },

    profileMini: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "20px 10px"
    },

    avatar: {
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        background:
            "linear-gradient(135deg, #60a5fa, #818cf8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "18px"
    },

    candidateName: {
        fontSize: "14px",
        fontWeight: "600"
    },

    candidateRole: {
        fontSize: "11px",
        color: "#94a3b8",
        marginTop: "3px"
    },

    navTitle: {
        fontSize: "10px",
        color: "#64748b",
        fontWeight: "700",
        letterSpacing: "1px",
        padding: "14px 12px 8px"
    },

    navButton: {
        width: "100%",
        border: "none",
        color: "#cbd5e1",
        background: "transparent",
        padding: "12px 14px",
        borderRadius: "9px",
        marginBottom: "4px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        transition: "0.2s"
    },

    activeNav: {
        background:
            "linear-gradient(90deg, #2563eb, #4f46e5)",
        color: "white",
        fontWeight: "600",
        boxShadow:
            "0 5px 15px rgba(37,99,235,0.25)"
    },

    sidebarBottom: {
        marginTop: "auto",
        borderTop:
            "1px solid rgba(255,255,255,0.1)",
        paddingTop: "15px"
    },

    logoutSide: {
        width: "100%",
        border: "none",
        background: "rgba(239,68,68,0.1)",
        color: "#fca5a5",
        padding: "12px 14px",
        borderRadius: "9px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "14px",
        display: "flex",
        gap: "12px",
        alignItems: "center"
    },

    overlay: {
        display: "none"
    },

    // MAIN

    mainWrapper: {
        marginLeft: "250px",
        minHeight: "100vh"
    },

    header: {
        height: "76px",
        background: "white",
        borderBottom:
            "1px solid #e5eaf1",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 34px",
        boxSizing: "border-box"
    },

    headerTitle: {
        fontSize: "19px",
        fontWeight: "700"
    },

    headerDate: {
        color: "#94a3b8",
        fontSize: "12px",
        marginTop: "3px"
    },

    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "18px"
    },

    notification: {
        border: "none",
        background: "#f8fafc",
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        cursor: "pointer",
        position: "relative",
        fontSize: "17px"
    },

    notificationDot: {
        position: "absolute",
        top: "-3px",
        right: "-3px",
        background: "#ef4444",
        color: "white",
        fontSize: "9px",
        minWidth: "16px",
        height: "16px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    headerAvatar: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background:
            "linear-gradient(135deg, #3b82f6, #6366f1)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700"
    },

    mobileMenu: {
        display: "none"
    },

    content: {
        padding: "30px 34px",
        maxWidth: "1500px",
        margin: "0 auto"
    },

    // WELCOME

    welcomeBanner: {
        background:
            "linear-gradient(120deg, #1d4ed8, #4338ca)",
        borderRadius: "18px",
        padding: "32px 38px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        marginBottom: "25px",
        boxShadow:
            "0 12px 30px rgba(37,99,235,0.18)"
    },

    welcomeSmall: {
        fontSize: "11px",
        letterSpacing: "1.5px",
        fontWeight: "700",
        opacity: 0.8,
        marginBottom: "8px"
    },

    welcomeTitle: {
        fontSize: "27px",
        margin: "0 0 10px",
        fontWeight: "700"
    },

    welcomeText: {
        margin: "0 0 20px",
        color: "#dbeafe",
        maxWidth: "600px",
        fontSize: "14px",
        lineHeight: "1.6"
    },

    findJobButton: {
        background: "white",
        color: "#1d4ed8",
        border: "none",
        padding: "12px 19px",
        borderRadius: "9px",
        fontWeight: "700",
        cursor: "pointer",
        fontSize: "13px"
    },

    arrow: {
        marginLeft: "8px"
    },

    bannerGraphic: {
        width: "170px",
        height: "170px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    graphicCircle: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.13)",
        border:
            "1px solid rgba(255,255,255,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "55px"
    },

    // STATS

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
        gap: "18px",
        marginBottom: "25px"
    },

    statCard: {
        background: "white",
        border: "1px solid #e8edf4",
        borderRadius: "14px",
        padding: "20px",
        display: "flex",
        gap: "15px",
        alignItems: "center",
        cursor: "pointer",
        transition: "0.2s",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.04)"
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

    statInfo: {
        minWidth: 0
    },

    statLabel: {
        color: "#64748b",
        fontSize: "12px",
        fontWeight: "600"
    },

    statNumber: {
        fontSize: "25px",
        fontWeight: "800",
        margin: "3px 0"
    },

    statLink: {
        color: "#2563eb",
        fontSize: "10px",
        fontWeight: "600"
    },

    profileComplete: {
        color: "#16a34a",
        fontWeight: "700",
        fontSize: "16px",
        margin: "4px 0"
    },

    // TWO COLUMN

    twoColumn: {
        display: "grid",
        gridTemplateColumns:
            "minmax(0, 1.35fr) minmax(320px, 0.8fr)",
        gap: "22px"
    },

    panel: {
        background: "white",
        border:
            "1px solid #e8edf4",
        borderRadius: "15px",
        padding: "23px",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.04)"
    },

    panelHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "18px"
    },

    panelTitle: {
        margin: 0,
        fontSize: "17px"
    },

    panelSubtitle: {
        color: "#94a3b8",
        fontSize: "11px",
        margin: "5px 0 0"
    },

    viewAll: {
        border: "none",
        background: "#eff6ff",
        color: "#2563eb",
        padding: "8px 12px",
        borderRadius: "7px",
        fontSize: "11px",
        fontWeight: "700",
        cursor: "pointer"
    },

    // APPLICATION

    applicationItem: {
        display: "flex",
        alignItems: "center",
        gap: "13px",
        padding: "14px 0",
        borderBottom:
            "1px solid #eef2f7"
    },

    companyIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    applicationInfo: {
        flex: 1
    },

    jobTitle: {
        fontSize: "13px",
        fontWeight: "700",
        marginBottom: "4px"
    },

    companyName: {
        fontSize: "11px",
        color: "#94a3b8"
    },

    statusBadge: {
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "9px",
        fontWeight: "800"
    },

    // INTERVIEW

    interviewItem: {
        display: "flex",
        gap: "14px",
        padding: "15px",
        background: "#f8fafc",
        borderRadius: "11px",
        marginBottom: "10px"
    },

    calendarIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        background: "#dcfce7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
    },

    interviewInfo: {
        flex: 1
    },

    interviewTitle: {
        fontWeight: "700",
        fontSize: "13px",
        marginBottom: "7px"
    },

    interviewDetail: {
        fontSize: "10px",
        color: "#64748b",
        marginBottom: "4px"
    },

    joinButton: {
        display: "inline-block",
        marginTop: "8px",
        color: "#2563eb",
        fontSize: "11px",
        fontWeight: "700",
        textDecoration: "none"
    },

    // EMPTY

    emptyState: {
        textAlign: "center",
        padding: "35px 15px",
        color: "#64748b"
    },

    emptyIcon: {
        fontSize: "35px",
        marginBottom: "8px"
    },

    
    primaryButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 17px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },

    loadingBox: {
        padding: "45px 10px",
        textAlign: "center",
        color: "#64748b",
        fontSize: "13px"
    },

    spinner: {
        width: "25px",
        height: "25px",
        border:
            "3px solid #e2e8f0",
        borderTop:
            "3px solid #2563eb",
        borderRadius: "50%",
        margin: "0 auto 10px"
    },

    // QUICK ACTIONS

    quickSection: {
        marginTop: "23px",
        background: "white",
        border:
            "1px solid #e8edf4",
        borderRadius: "15px",
        padding: "23px",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.04)"
    },

    quickTitle: {
        margin: 0,
        fontSize: "17px"
    },

    quickSubtitle: {
        color: "#94a3b8",
        fontSize: "11px",
        marginTop: "5px"
    },

    quickGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, 1fr)",
        gap: "12px",
        marginTop: "18px"
    },

    quickCard: {
        border:
            "1px solid #e6ebf2",
        background: "#fafcff",
        padding: "17px",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        fontSize: "12px",
        fontWeight: "700",
        color: "#334155"
    },

    quickIcon: {
        fontSize: "21px",
        marginBottom: "5px"
    },

    // FOOTER

    footer: {
        padding: "25px 34px",
        color: "#94a3b8",
        fontSize: "11px",
        display: "flex",
        justifyContent: "space-between"
    }
};

export default CandidateDashboard;