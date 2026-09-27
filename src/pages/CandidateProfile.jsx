import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CandidateProfile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        active: true
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    // =====================================================
    // LOAD PROFILE
    // =====================================================

    const loadProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await axios.get(
                "http://localhost:8085/api/auth/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Profile:", response.data);

            setProfile(response.data);

        } catch (err) {

            console.error("Profile error:", err);

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("role");

                navigate("/login");

            } else {

                setError("Unable to load profile.");

            }

        } finally {

            setLoading(false);

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
    // INITIAL
    // =====================================================

    const getInitial = () => {

        if (!profile.fullName) {
            return "C";
        }

        return profile.fullName
            .charAt(0)
            .toUpperCase();
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div style={styles.loadingPage}>

                <div style={styles.spinner}></div>

                <h3>
                    Loading your profile...
                </h3>

                <p>
                    Please wait a moment
                </p>

            </div>

        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div style={styles.container}>

            {/* =================================================
                TOP NAVBAR
            ================================================= */}

            <header style={styles.header}>

                <div style={styles.brand}>

                    <div style={styles.brandLogo}>
                        RP
                    </div>

                    <div>

                        <h2 style={styles.brandName}>
                            Recruitment Portal
                        </h2>

                        <span style={styles.brandSub}>
                            Candidate Workspace
                        </span>

                    </div>

                </div>


                <div style={styles.headerRight}>

                    <div style={styles.notification}>
                        🔔
                    </div>

                    <div style={styles.userMini}>

                        <div style={styles.miniAvatar}>
                            {getInitial()}
                        </div>

                        <div>

                            <strong>
                                {profile.fullName ||
                                    "Candidate"}
                            </strong>

                            <small>
                                Candidate
                            </small>

                        </div>

                    </div>


                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            <div style={styles.body}>

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside style={styles.sidebar}>

                    <div style={styles.sidebarHeading}>
                        MAIN MENU
                    </div>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/candidate-dashboard")
                        }
                    >
                        <span style={styles.icon}>
                            🏠
                        </span>

                        Dashboard
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/jobs")
                        }
                    >
                        <span style={styles.icon}>
                            💼
                        </span>

                        Find Jobs
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/my-applications")
                        }
                    >
                        <span style={styles.icon}>
                            📄
                        </span>

                        My Applications
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/interviews")
                        }
                    >
                        <span style={styles.icon}>
                            📅
                        </span>

                        Interviews
                    </button>


                    <button
                        style={styles.activeMenu}
                    >
                        <span style={styles.icon}>
                            👤
                        </span>

                        Profile
                    </button>


                    <div style={styles.sidebarBottom}>

                        <div style={styles.helpCard}>

                            <div style={styles.helpIcon}>
                                💡
                            </div>

                            <strong>
                                Need Help?
                            </strong>

                            <p>
                                Explore jobs and build
                                your career.
                            </p>

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

                            <div style={styles.breadcrumb}>
                                Dashboard / Profile
                            </div>

                            <h1 style={styles.pageTitle}>
                                My Profile
                            </h1>

                            <p style={styles.subtitle}>
                                View and manage your personal
                                account information.
                            </p>

                        </div>


                        <button
                            style={styles.backButton}
                            onClick={() =>
                                navigate(
                                    "/candidate-dashboard"
                                )
                            }
                        >
                            ← Dashboard
                        </button>

                    </div>


                    {error && (

                        <div style={styles.error}>
                            ⚠️ {error}
                        </div>

                    )}


                    {/* =================================================
                        PROFILE HERO
                    ================================================= */}

                    <section style={styles.profileHero}>

                        <div style={styles.heroBackground}></div>

                        <div style={styles.heroContent}>

                            <div style={styles.largeAvatar}>

                                {getInitial()}

                                <div style={styles.onlineDot}></div>

                            </div>


                            <div style={styles.profileIdentity}>

                                <div style={styles.nameRow}>

                                    <h2>
                                        {profile.fullName ||
                                            "Candidate"}
                                    </h2>

                                    <span
                                        style={
                                            styles.verifiedBadge
                                        }
                                    >
                                        ✓ Verified
                                    </span>

                                </div>


                                <p>
                                    {profile.email ||
                                        "Email not available"}
                                </p>


                                <div style={styles.tags}>

                                    <span>
                                        Candidate
                                    </span>

                                    <span>
                                        🎯 Job Seeker
                                    </span>

                                    <span>
                                        🟢 Active
                                    </span>

                                </div>

                            </div>


                            <div style={styles.profileScore}>

                                <div style={styles.scoreCircle}>
                                    80%
                                </div>

                                <span>
                                    Profile Complete
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        STATS
                    ================================================= */}

                    <div style={styles.statsGrid}>

                        <div style={styles.statCard}>

                            <div
                                style={{
                                    ...styles.statIcon,
                                    background: "#eff6ff"
                                }}
                            >
                                💼
                            </div>

                            <div>

                                <span>
                                    Job Applications
                                </span>

                                <h2>
                                    —
                                </h2>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div
                                style={{
                                    ...styles.statIcon,
                                    background: "#f0fdf4"
                                }}
                            >
                                📅
                            </div>

                            <div>

                                <span>
                                    Interviews
                                </span>

                                <h2>
                                    —
                                </h2>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div
                                style={{
                                    ...styles.statIcon,
                                    background: "#fefce8"
                                }}
                            >
                                📄
                            </div>

                            <div>

                                <span>
                                    Resume
                                </span>

                                <h2>
                                    Uploaded
                                </h2>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div
                                style={{
                                    ...styles.statIcon,
                                    background: "#f5f3ff"
                                }}
                            >
                                ⭐
                            </div>

                            <div>

                                <span>
                                    Account
                                </span>

                                <h2>
                                    Active
                                </h2>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        INFORMATION
                    ================================================= */}

                    <div style={styles.contentGrid}>

                        {/* PERSONAL INFORMATION */}

                        <section style={styles.infoCard}>

                            <div style={styles.cardHeader}>

                                <div>

                                    <h2>
                                        Personal Information
                                    </h2>

                                    <p>
                                        Your basic account details
                                    </p>

                                </div>

                                <div style={styles.cardIcon}>
                                    👤
                                </div>

                            </div>


                            <div style={styles.infoGrid}>

                                <div style={styles.infoItem}>

                                    <span>
                                        FULL NAME
                                    </span>

                                    <strong>
                                        {profile.fullName ||
                                            "Not provided"}
                                    </strong>

                                </div>


                                <div style={styles.infoItem}>

                                    <span>
                                        EMAIL ADDRESS
                                    </span>

                                    <strong>
                                        {profile.email ||
                                            "Not provided"}
                                    </strong>

                                </div>


                                <div style={styles.infoItem}>

                                    <span>
                                        PHONE NUMBER
                                    </span>

                                    <strong>
                                        {profile.phone ||
                                            "Not provided"}
                                    </strong>

                                </div>


                                <div style={styles.infoItem}>

                                    <span>
                                        ACCOUNT ROLE
                                    </span>

                                    <strong>
                                        {profile.role ||
                                            "CANDIDATE"}
                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* ACCOUNT INFORMATION */}

                        <section style={styles.infoCard}>

                            <div style={styles.cardHeader}>

                                <div>

                                    <h2>
                                        Account Information
                                    </h2>

                                    <p>
                                        Your account status
                                    </p>

                                </div>

                                <div style={styles.cardIcon}>
                                    ⚙️
                                </div>

                            </div>


                            <div style={styles.accountList}>

                                <div style={styles.accountRow}>

                                    <div>

                                        <span>
                                            Account Status
                                        </span>

                                        <strong
                                            style={
                                                styles.activeText
                                            }
                                        >
                                            ● Active
                                        </strong>

                                    </div>

                                    <span
                                        style={
                                            styles.activeBadge
                                        }
                                    >
                                        ACTIVE
                                    </span>

                                </div>


                                <div style={styles.accountRow}>

                                    <div>

                                        <span>
                                            Account Type
                                        </span>

                                        <strong>
                                            Candidate
                                        </strong>

                                    </div>

                                    <span>
                                        👤
                                    </span>

                                </div>


                                <div style={styles.accountRow}>

                                    <div>

                                        <span>
                                            Email Verification
                                        </span>

                                        <strong
                                            style={
                                                styles.verifiedText
                                            }
                                        >
                                            ✓ Verified
                                        </strong>

                                    </div>

                                    <span>
                                        🔐
                                    </span>

                                </div>

                            </div>

                        </section>

                    </div>


                    {/* =================================================
                        CAREER SECTION
                    ================================================= */}

                    <section style={styles.careerCard}>

                        <div>

                            <div style={styles.careerIcon}>
                                🚀
                            </div>

                        </div>

                        <div style={styles.careerContent}>

                            <h2>
                                Ready for your next opportunity?
                            </h2>

                            <p>
                                Explore the latest job openings and
                                find the perfect role for your skills.
                            </p>

                        </div>

                        <button
                            style={styles.exploreButton}
                            onClick={() =>
                                navigate("/jobs")
                            }
                        >
                            Explore Jobs →
                        </button>

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
        background: "#f5f7fb",
        fontFamily:
            "'Segoe UI', Arial, sans-serif",
        color: "#172033"
    },


    // ================= HEADER =================

    header: {
        height: "72px",
        background:
            "linear-gradient(135deg, #0f172a, #1e3a8a)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow:
            "0 4px 18px rgba(0,0,0,0.12)"
    },


    brand: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    brandLogo: {
        width: "43px",
        height: "43px",
        borderRadius: "11px",
        background:
            "linear-gradient(135deg,#3b82f6,#6366f1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        fontSize: "15px"
    },


    brandName: {
        margin: 0,
        fontSize: "18px"
    },


    brandSub: {
        color: "#cbd5e1",
        fontSize: "11px"
    },


    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },


    notification: {
        fontSize: "20px",
        cursor: "pointer"
    },


    userMini: {
        display: "flex",
        alignItems: "center",
        gap: "9px"
    },


    miniAvatar: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background:
            "linear-gradient(135deg,#3b82f6,#6366f1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700"
    },


    logoutButton: {
        background: "#ef4444",
        color: "white",
        border: "none",
        padding: "9px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // ================= BODY =================

    body: {
        display: "flex",
        minHeight: "calc(100vh - 72px)"
    },


    // ================= SIDEBAR =================

    sidebar: {
        width: "240px",
        background: "#ffffff",
        padding: "28px 15px",
        boxSizing: "border-box",
        boxShadow:
            "2px 0 15px rgba(15,23,42,0.05)",
        flexShrink: 0
    },


    sidebarHeading: {
        fontSize: "10px",
        color: "#94a3b8",
        fontWeight: "800",
        letterSpacing: "1.2px",
        padding: "0 13px",
        marginBottom: "18px"
    },


    menuButton: {
        width: "100%",
        border: "none",
        background: "transparent",
        padding: "13px 14px",
        marginBottom: "7px",
        borderRadius: "9px",
        textAlign: "left",
        fontSize: "14px",
        cursor: "pointer",
        color: "#475569",
        display: "flex",
        alignItems: "center",
        gap: "13px"
    },


    activeMenu: {
        width: "100%",
        border: "none",
        background:
            "linear-gradient(90deg,#eff6ff,#f8faff)",
        color: "#2563eb",
        padding: "13px 14px",
        marginBottom: "7px",
        borderRadius: "9px",
        textAlign: "left",
        fontSize: "14px",
        cursor: "pointer",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        gap: "13px",
        borderLeft: "4px solid #2563eb"
    },


    icon: {
        fontSize: "17px",
        width: "22px"
    },


    sidebarBottom: {
        marginTop: "50px"
    },


    helpCard: {
        background:
            "linear-gradient(135deg,#eff6ff,#eef2ff)",
        padding: "18px",
        borderRadius: "12px",
        color: "#1e3a8a"
    },


    helpIcon: {
        fontSize: "25px",
        marginBottom: "8px"
    },


    // ================= MAIN =================

    main: {
        flex: 1,
        padding: "35px",
        boxSizing: "border-box",
        maxWidth: "1500px"
    },


    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px"
    },


    breadcrumb: {
        color: "#94a3b8",
        fontSize: "12px",
        marginBottom: "8px"
    },


    pageTitle: {
        margin: 0,
        fontSize: "31px",
        fontWeight: "750",
        color: "#0f172a"
    },


    subtitle: {
        color: "#64748b",
        marginTop: "7px"
    },


    backButton: {
        background: "white",
        border: "1px solid #e2e8f0",
        color: "#334155",
        padding: "10px 17px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },


    error: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "14px",
        borderRadius: "9px",
        marginBottom: "20px"
    },


    // ================= PROFILE HERO =================

    profileHero: {
        background: "white",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow:
            "0 5px 25px rgba(15,23,42,0.07)",
        marginBottom: "25px",
        position: "relative"
    },


    heroBackground: {
        height: "100px",
        background:
            "linear-gradient(135deg,#1d4ed8,#4f46e5,#7c3aed)"
    },


    heroContent: {
        display: "flex",
        alignItems: "center",
        gap: "22px",
        padding: "0 30px 28px",
        marginTop: "-45px",
        position: "relative"
    },


    largeAvatar: {
        width: "95px",
        height: "95px",
        borderRadius: "50%",
        background:
            "linear-gradient(135deg,#3b82f6,#6366f1)",
        border: "5px solid white",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "38px",
        fontWeight: "800",
        position: "relative",
        boxShadow:
            "0 8px 20px rgba(37,99,235,0.25)"
    },


    onlineDot: {
        width: "14px",
        height: "14px",
        background: "#22c55e",
        border: "3px solid white",
        borderRadius: "50%",
        position: "absolute",
        right: "3px",
        bottom: "8px"
    },


    profileIdentity: {
        flex: 1,
        marginTop: "42px"
    },


    nameRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },


    nameRowH2: {
        margin: 0
    },


    verifiedBadge: {
        background: "#dcfce7",
        color: "#15803d",
        padding: "4px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700"
    },


    tags: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginTop: "10px"
    },


    profileScore: {
        textAlign: "center",
        marginTop: "35px",
        color: "#64748b",
        fontSize: "12px"
    },


    scoreCircle: {
        width: "58px",
        height: "58px",
        borderRadius: "50%",
        border: "5px solid #3b82f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        color: "#2563eb",
        margin: "auto auto 6px"
    },


    // ================= STATS =================

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4,1fr)",
        gap: "18px",
        marginBottom: "25px"
    },


    statCard: {
        background: "white",
        borderRadius: "13px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow:
            "0 3px 15px rgba(15,23,42,0.05)"
    },


    statIcon: {
        width: "46px",
        height: "46px",
        borderRadius: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "21px"
    },


    // ================= CONTENT =================

    contentGrid: {
        display: "grid",
        gridTemplateColumns:
            "1.5fr 1fr",
        gap: "22px"
    },


    infoCard: {
        background: "white",
        borderRadius: "15px",
        padding: "25px",
        boxShadow:
            "0 4px 18px rgba(15,23,42,0.05)"
    },


    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "22px"
    },


    cardIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },


    infoGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2,1fr)",
        gap: "15px"
    },


    infoItem: {
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        padding: "16px",
        borderRadius: "10px"
    },


    // ================= ACCOUNT =================

    accountList: {
        display: "flex",
        flexDirection: "column"
    },


    accountRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "17px 0",
        borderBottom: "1px solid #e2e8f0"
    },


    activeText: {
        display: "block",
        color: "#16a34a",
        marginTop: "5px"
    },


    activeBadge: {
        background: "#dcfce7",
        color: "#15803d",
        padding: "5px 9px",
        borderRadius: "15px",
        fontSize: "10px",
        fontWeight: "800"
    },


    verifiedText: {
        display: "block",
        color: "#2563eb",
        marginTop: "5px"
    },


    // ================= CAREER =================

    careerCard: {
        marginTop: "22px",
        background:
            "linear-gradient(135deg,#1d4ed8,#4f46e5)",
        borderRadius: "15px",
        padding: "25px 30px",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "18px",
        boxShadow:
            "0 8px 25px rgba(37,99,235,0.2)"
    },


    careerIcon: {
        fontSize: "35px"
    },


    careerContent: {
        flex: 1
    },


    exploreButton: {
        background: "white",
        color: "#2563eb",
        border: "none",
        padding: "11px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "700"
    },


    // ================= LOADING =================

    loadingPage: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        color: "#475569"
    },


    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #2563eb",
        borderRadius: "50%",
        marginBottom: "15px"
    }

};

export default CandidateProfile;