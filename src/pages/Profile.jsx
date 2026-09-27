import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await axios.get(
                "http://localhost:8085/api/users/profile",
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
                setError("Unable to load profile.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.logo}>
                    Recruitment Portal
                </div>

                <div style={styles.headerRight}>
                    <span>
                        Candidate
                    </span>

                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* LAYOUT */}
            <div style={styles.layout}>

                {/* SIDEBAR */}
                <aside style={styles.sidebar}>

                    <div style={styles.sidebarTitle}>
                        Candidate
                    </div>

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/candidate-dashboard")
                        }
                    >
                        🏠 Dashboard
                    </button>

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/jobs")
                        }
                    >
                        💼 Jobs
                    </button>

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/my-applications")
                        }
                    >
                        📋 My Applications
                    </button>

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate("/interviews")
                        }
                    >
                        📅 Interviews
                    </button>

                    <button
                        style={styles.activeMenuButton}
                    >
                        👤 Profile
                    </button>

                </aside>

                {/* MAIN CONTENT */}
                <main style={styles.main}>

                    <div style={styles.pageHeader}>
                        <div>
                            <h1 style={styles.title}>
                                My Profile
                            </h1>

                            <p style={styles.subtitle}>
                                View your personal account information
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div style={styles.error}>
                            {error}
                        </div>
                    )}

                    {/* PROFILE CARD */}
                    <div style={styles.profileCard}>

                        <div style={styles.profileHeader}>

                            <div style={styles.avatar}>
                                {profile?.fullName
                                    ? profile.fullName
                                        .charAt(0)
                                        .toUpperCase()
                                    : "U"}
                            </div>

                            <div>
                                <h2 style={styles.name}>
                                    {profile?.fullName || "Candidate"}
                                </h2>

                                <p style={styles.email}>
                                    {profile?.email || "No email available"}
                                </p>

                                <span style={styles.roleBadge}>
                                    CANDIDATE
                                </span>
                            </div>

                        </div>

                        <div style={styles.divider}></div>

                        <h3 style={styles.sectionTitle}>
                            Personal Information
                        </h3>

                        <div style={styles.infoGrid}>

                            <div style={styles.infoBox}>
                                <label style={styles.label}>
                                    Full Name
                                </label>

                                <div style={styles.value}>
                                    {profile?.fullName || "-"}
                                </div>
                            </div>

                            <div style={styles.infoBox}>
                                <label style={styles.label}>
                                    Email Address
                                </label>

                                <div style={styles.value}>
                                    {profile?.email || "-"}
                                </div>
                            </div>

                            <div style={styles.infoBox}>
                                <label style={styles.label}>
                                    Phone Number
                                </label>

                                <div style={styles.value}>
                                    {profile?.phone || "Not provided"}
                                </div>
                            </div>

                            <div style={styles.infoBox}>
                                <label style={styles.label}>
                                    Account Role
                                </label>

                                <div style={styles.value}>
                                    {profile?.role || "CANDIDATE"}
                                </div>
                            </div>

                        </div>

                        <div style={styles.accountSection}>

                            <h3 style={styles.sectionTitle}>
                                Account Status
                            </h3>

                            <div style={styles.statusRow}>

                                <span style={styles.statusDot}></span>

                                <span style={styles.activeText}>
                                    {profile?.active === false
                                        ? "Inactive"
                                        : "Active Account"}
                                </span>

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
        backgroundColor: "#f4f7fb",
        fontFamily: "Arial, Helvetica, sans-serif"
    },

    header: {
        height: "68px",
        backgroundColor: "#172554",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxSizing: "border-box"
    },

    logo: {
        fontSize: "22px",
        fontWeight: "700"
    },

    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        fontSize: "14px"
    },

    logoutButton: {
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        padding: "9px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    },

    layout: {
        display: "flex",
        minHeight: "calc(100vh - 68px)"
    },

    sidebar: {
        width: "235px",
        backgroundColor: "#ffffff",
        padding: "25px 15px",
        boxSizing: "border-box",
        borderRight: "1px solid #e5e7eb"
    },

    sidebarTitle: {
        fontSize: "13px",
        fontWeight: "700",
        color: "#94a3b8",
        textTransform: "uppercase",
        padding: "0 12px 15px"
    },

    menuButton: {
        width: "100%",
        border: "none",
        backgroundColor: "transparent",
        padding: "13px 15px",
        marginBottom: "6px",
        borderRadius: "8px",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "15px",
        color: "#475569"
    },

    activeMenuButton: {
        width: "100%",
        border: "none",
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        padding: "13px 15px",
        marginBottom: "6px",
        borderRadius: "8px",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "700"
    },

    main: {
        flex: 1,
        padding: "35px 45px",
        boxSizing: "border-box"
    },

    pageHeader: {
        marginBottom: "30px"
    },

    title: {
        margin: 0,
        fontSize: "30px",
        color: "#0f172a"
    },

    subtitle: {
        color: "#64748b",
        marginTop: "8px"
    },

    profileCard: {
        backgroundColor: "white",
        borderRadius: "14px",
        padding: "35px",
        maxWidth: "900px",
        boxShadow: "0 5px 20px rgba(15, 23, 42, 0.07)"
    },

    profileHeader: {
        display: "flex",
        alignItems: "center",
        gap: "22px"
    },

    avatar: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: "#2563eb",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        fontWeight: "700"
    },

    name: {
        margin: 0,
        fontSize: "25px",
        color: "#0f172a"
    },

    email: {
        margin: "7px 0",
        color: "#64748b"
    },

    roleBadge: {
        display: "inline-block",
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700"
    },

    divider: {
        height: "1px",
        backgroundColor: "#e2e8f0",
        margin: "30px 0"
    },

    sectionTitle: {
        color: "#0f172a",
        marginBottom: "20px",
        fontSize: "18px"
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
    },

    infoBox: {
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "9px",
        padding: "17px"
    },

    label: {
        display: "block",
        color: "#64748b",
        fontSize: "13px",
        marginBottom: "7px"
    },

    value: {
        color: "#0f172a",
        fontSize: "15px",
        fontWeight: "600"
    },

    accountSection: {
        marginTop: "30px"
    },

    statusRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backgroundColor: "#f0fdf4",
        border: "1px solid #bbf7d0",
        padding: "14px 18px",
        borderRadius: "8px"
    },

    statusDot: {
        width: "10px",
        height: "10px",
        backgroundColor: "#22c55e",
        borderRadius: "50%"
    },

    activeText: {
        color: "#15803d",
        fontWeight: "600"
    },

    loading: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial"
    },

    spinner: {
        width: "35px",
        height: "35px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #2563eb",
        borderRadius: "50%",
        marginBottom: "15px"
    },

    error: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px"
    }
};

export default Profile;