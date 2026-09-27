import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RecruiterProfile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8085/api/auth/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

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
                setError(
                    "Unable to load profile. Please check the backend profile API."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    if (loading) {
        return (
            <div style={styles.loadingPage}>
                <div style={styles.loadingBox}>
                    Loading recruiter profile...
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            {/* HEADER */}
            <header style={styles.header}>
                <div>
                    <div style={styles.logo}>
                        Recruitment Portal
                    </div>

                    <div style={styles.headerSubtitle}>
                        Recruiter Management System
                    </div>
                </div>

                <button
                    style={styles.logoutButton}
                    onClick={logout}
                >
                    Logout
                </button>
            </header>

            <div style={styles.body}>

                {/* SIDEBAR */}
                <aside style={styles.sidebar}>

                    <div style={styles.sidebarTitle}>
                        RECRUITER
                    </div>

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/recruiter-dashboard")
                        }
                    >
                        <span>🏠</span>
                        Dashboard
                    </button>

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/recruiter-jobs")
                        }
                    >
                        <span>💼</span>
                        Jobs
                    </button>

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/recruiter-applicants")
                        }
                    >
                        <span>👥</span>
                        Applicants
                    </button>

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/recruiter-interviews")
                        }
                    >
                        <span>📅</span>
                        Interviews
                    </button>

                    <button
                        style={styles.activeMenuButton}
                    >
                        <span>👤</span>
                        Profile
                    </button>

                </aside>

                {/* MAIN */}
                <main style={styles.main}>

                    <div style={styles.pageHeader}>
                        <div>
                            <h1 style={styles.title}>
                                Recruiter Profile
                            </h1>

                            <p style={styles.subtitle}>
                                Manage and view your recruiter account information.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div style={styles.error}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* PROFILE CARD */}
                    <div style={styles.profileCard}>

                        <div style={styles.profileHeader}>

                            <div style={styles.avatar}>
                                {profile?.fullName
                                    ? profile.fullName.charAt(0).toUpperCase()
                                    : "R"}
                            </div>

                            <div>
                                <h2 style={styles.profileName}>
                                    {profile?.fullName || "Recruiter"}
                                </h2>

                                <p style={styles.profileRole}>
                                    Recruiter
                                </p>
                            </div>

                        </div>

                        <div style={styles.divider}></div>

                        <div style={styles.infoGrid}>

                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>
                                    FULL NAME
                                </div>

                                <div style={styles.infoValue}>
                                    {profile?.fullName || "Not available"}
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>
                                    EMAIL
                                </div>

                                <div style={styles.infoValue}>
                                    {profile?.email || "Not available"}
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>
                                    PHONE
                                </div>

                                <div style={styles.infoValue}>
                                    {profile?.phone || "Not available"}
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>
                                    ROLE
                                </div>

                                <div style={styles.roleBadge}>
                                    {profile?.role || "RECRUITER"}
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>
                                    ACCOUNT STATUS
                                </div>

                                <div style={styles.statusBadge}>
                                    {profile?.active === false
                                        ? "INACTIVE"
                                        : "ACTIVE"}
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>
                                    ACCOUNT ID
                                </div>

                                <div style={styles.infoValue}>
                                    #{profile?.id || "N/A"}
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* QUICK ACTIONS */}
                    <div style={styles.sectionTitle}>
                        Quick Actions
                    </div>

                    <div style={styles.quickActions}>

                        <div
                            style={styles.actionCard}
                            onClick={() =>
                                navigate("/recruiter-jobs")
                            }
                        >
                            <div style={styles.actionIcon}>
                                💼
                            </div>

                            <div>
                                <h3 style={styles.actionTitle}>
                                    Manage Jobs
                                </h3>

                                <p style={styles.actionText}>
                                    Create, edit and manage job postings.
                                </p>
                            </div>
                        </div>

                        <div
                            style={styles.actionCard}
                            onClick={() =>
                                navigate("/recruiter-applicants")
                            }
                        >
                            <div style={styles.actionIcon}>
                                👥
                            </div>

                            <div>
                                <h3 style={styles.actionTitle}>
                                    View Applicants
                                </h3>

                                <p style={styles.actionText}>
                                    Review candidates and resumes.
                                </p>
                            </div>
                        </div>

                        <div
                            style={styles.actionCard}
                            onClick={() =>
                                navigate("/recruiter-interviews")
                            }
                        >
                            <div style={styles.actionIcon}>
                                📅
                            </div>

                            <div>
                                <h3 style={styles.actionTitle}>
                                    Interviews
                                </h3>

                                <p style={styles.actionText}>
                                    Schedule and manage interviews.
                                </p>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily: "Arial, sans-serif"
    },

    header: {
        height: "70px",
        background: "#172554",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 35px",
        boxSizing: "border-box"
    },

    logo: {
        fontSize: "21px",
        fontWeight: "700"
    },

    headerSubtitle: {
        fontSize: "12px",
        marginTop: "3px",
        color: "#c7d2fe"
    },

    logoutButton: {
        border: "none",
        background: "#ef4444",
        color: "white",
        padding: "10px 20px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    },

    body: {
        display: "flex",
        minHeight: "calc(100vh - 70px)"
    },

    sidebar: {
        width: "235px",
        background: "#ffffff",
        padding: "28px 16px",
        boxSizing: "border-box",
        borderRight: "1px solid #e5e7eb"
    },

    sidebarTitle: {
        fontSize: "12px",
        fontWeight: "700",
        color: "#94a3b8",
        marginBottom: "18px",
        paddingLeft: "12px"
    },

    menuButton: {
        width: "100%",
        border: "none",
        background: "transparent",
        padding: "13px 14px",
        marginBottom: "7px",
        borderRadius: "8px",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "14px",
        color: "#475569"
    },

    activeMenuButton: {
        width: "100%",
        border: "none",
        background: "#e0e7ff",
        padding: "13px 14px",
        marginBottom: "7px",
        borderRadius: "8px",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "14px",
        color: "#3730a3",
        fontWeight: "700"
    },

    main: {
        flex: 1,
        padding: "35px",
        boxSizing: "border-box"
    },

    pageHeader: {
        marginBottom: "28px"
    },

    title: {
        margin: 0,
        fontSize: "30px",
        color: "#0f172a"
    },

    subtitle: {
        marginTop: "8px",
        color: "#64748b",
        fontSize: "14px"
    },

    error: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "15px 18px",
        borderRadius: "8px",
        marginBottom: "20px"
    },

    profileCard: {
        background: "white",
        borderRadius: "14px",
        padding: "30px",
        boxShadow: "0 4px 18px rgba(15, 23, 42, 0.07)"
    },

    profileHeader: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },

    avatar: {
        width: "75px",
        height: "75px",
        borderRadius: "50%",
        background: "#4f46e5",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "30px",
        fontWeight: "700"
    },

    profileName: {
        margin: 0,
        fontSize: "23px",
        color: "#0f172a"
    },

    profileRole: {
        margin: "6px 0 0",
        color: "#64748b"
    },

    divider: {
        height: "1px",
        background: "#e5e7eb",
        margin: "28px 0"
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "25px"
    },

    infoItem: {
        padding: "17px",
        background: "#f8fafc",
        borderRadius: "9px"
    },

    infoLabel: {
        fontSize: "11px",
        color: "#94a3b8",
        fontWeight: "700",
        marginBottom: "7px"
    },

    infoValue: {
        fontSize: "15px",
        color: "#1e293b",
        fontWeight: "600"
    },

    roleBadge: {
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: "20px",
        background: "#dbeafe",
        color: "#1d4ed8",
        fontWeight: "700",
        fontSize: "12px"
    },

    statusBadge: {
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: "20px",
        background: "#dcfce7",
        color: "#15803d",
        fontWeight: "700",
        fontSize: "12px"
    },

    sectionTitle: {
        marginTop: "30px",
        marginBottom: "15px",
        fontSize: "18px",
        fontWeight: "700",
        color: "#0f172a"
    },

    quickActions: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "18px"
    },

    actionCard: {
        background: "white",
        borderRadius: "12px",
        padding: "22px",
        display: "flex",
        gap: "15px",
        alignItems: "center",
        cursor: "pointer",
        boxShadow: "0 3px 12px rgba(15, 23, 42, 0.06)"
    },

    actionIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "10px",
        background: "#eef2ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "23px"
    },

    actionTitle: {
        margin: 0,
        fontSize: "15px",
        color: "#1e293b"
    },

    actionText: {
        margin: "5px 0 0",
        color: "#64748b",
        fontSize: "12px",
        lineHeight: "1.5"
    },

    loadingPage: {
        minHeight: "100vh",
        background: "#f4f7fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif"
    },

    loadingBox: {
        background: "white",
        padding: "30px 50px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        color: "#475569"
    }
};

export default RecruiterProfile;