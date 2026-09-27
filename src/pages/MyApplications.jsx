import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyApplications() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");


    // =========================================================
    // LOAD APPLICATIONS
    // =========================================================

    useEffect(() => {
        fetchApplications();
    }, []);


    const fetchApplications = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await axios.get(
                "http://localhost:8085/api/applications/my-applications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setApplications(response.data || []);

        } catch (err) {

            console.error("Applications error:", err);

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("role");

                navigate("/login");

            } else {

                setError(
                    "Unable to load your applications."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };


    // =========================================================
    // STATUS STYLE
    // =========================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "APPLIED":
                return styles.statusApplied;

            case "SHORTLISTED":
                return styles.statusShortlisted;

            case "REJECTED":
                return styles.statusRejected;

            case "SELECTED":
                return styles.statusSelected;

            case "INTERVIEW":
                return styles.statusInterview;

            default:
                return styles.statusDefault;
        }
    };


    // =========================================================
    // FILTER APPLICATIONS
    // =========================================================

    const filteredApplications = useMemo(() => {

        return applications.filter(application => {

            const job = application.job;

            const searchText =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                job?.jobTitle
                    ?.toLowerCase()
                    .includes(searchText) ||
                job?.company
                    ?.toLowerCase()
                    .includes(searchText) ||
                job?.location
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "ALL" ||
                application.status === statusFilter;

            return matchesSearch && matchesStatus;

        });

    }, [applications, search, statusFilter]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const totalApplications =
        applications.length;

    const shortlisted =
        applications.filter(
            app => app.status === "SHORTLISTED"
        ).length;

    const rejected =
        applications.filter(
            app => app.status === "REJECTED"
        ).length;

    const selected =
        applications.filter(
            app => app.status === "SELECTED"
        ).length;


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div style={styles.container}>

            {/* =================================================
                TOP NAVBAR
            ================================================= */}

            <header style={styles.header}>

                <div style={styles.brandArea}>

                    <div style={styles.logoIcon}>
                        RP
                    </div>

                    <div>

                        <h2 style={styles.logo}>
                            Recruitment Portal
                        </h2>

                        <span style={styles.logoSub}>
                            Candidate Workspace
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
                        Dashboard
                    </button>

                    <button
                        style={styles.profileButton}
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        👤 Profile
                    </button>

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

                    <div style={styles.sidebarSection}>

                        <div style={styles.sidebarLabel}>
                            MAIN MENU
                        </div>


                        <button
                            style={styles.menuButton}
                            onClick={() =>
                                navigate(
                                    "/candidate-dashboard"
                                )
                            }
                        >
                            <span>🏠</span>
                            Dashboard
                        </button>


                        <button
                            style={styles.menuButton}
                            onClick={() =>
                                navigate("/jobs")
                            }
                        >
                            <span>💼</span>
                            Find Jobs
                        </button>


                        <button
                            style={{
                                ...styles.menuButton,
                                ...styles.activeMenu
                            }}
                        >
                            <span>📋</span>
                            My Applications
                        </button>


                        <button
                            style={styles.menuButton}
                            onClick={() =>
                                navigate(
                                    "/interviews"
                                )
                            }
                        >
                            <span>📅</span>
                            Interviews
                        </button>


                        <button
                            style={styles.menuButton}
                            onClick={() =>
                                navigate("/profile")
                            }
                        >
                            <span>👤</span>
                            My Profile
                        </button>

                    </div>


                    <div style={styles.sidebarBottom}>

                        <div style={styles.helpCard}>

                            <div style={styles.helpIcon}>
                                💡
                            </div>

                            <strong>
                                Need Help?
                            </strong>

                            <p>
                                Keep your profile and
                                resume updated.
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
                                Candidate / Applications
                            </div>

                            <h1 style={styles.pageTitle}>
                                My Applications
                            </h1>

                            <p style={styles.subtitle}>
                                Track and manage all your
                                job applications in one place.
                            </p>

                        </div>


                        <button
                            style={styles.findJobButton}
                            onClick={() =>
                                navigate("/jobs")
                            }
                        >
                            + Find New Jobs
                        </button>

                    </div>


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <div style={styles.statsGrid}>

                        <div style={styles.statCard}>

                            <div
                                style={{
                                    ...styles.statIcon,
                                    backgroundColor: "#e0edff"
                                }}
                            >
                                📋
                            </div>

                            <div>

                                <span style={styles.statLabel}>
                                    Total Applications
                                </span>

                                <h2 style={styles.statNumber}>
                                    {totalApplications}
                                </h2>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div
                                style={{
                                    ...styles.statIcon,
                                    backgroundColor: "#dcfce7"
                                }}
                            >
                                ✓
                            </div>

                            <div>

                                <span style={styles.statLabel}>
                                    Shortlisted
                                </span>

                                <h2 style={styles.statNumber}>
                                    {shortlisted}
                                </h2>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div
                                style={{
                                    ...styles.statIcon,
                                    backgroundColor: "#ede9fe"
                                }}
                            >
                                ⭐
                            </div>

                            <div>

                                <span style={styles.statLabel}>
                                    Selected
                                </span>

                                <h2 style={styles.statNumber}>
                                    {selected}
                                </h2>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div
                                style={{
                                    ...styles.statIcon,
                                    backgroundColor: "#fee2e2"
                                }}
                            >
                                ✕
                            </div>

                            <div>

                                <span style={styles.statLabel}>
                                    Rejected
                                </span>

                                <h2 style={styles.statNumber}>
                                    {rejected}
                                </h2>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        APPLICATIONS SECTION
                    ================================================= */}

                    <section style={styles.applicationSection}>

                        {/* TOOLBAR */}

                        <div style={styles.toolbar}>

                            <div style={styles.searchBox}>

                                <span style={styles.searchIcon}>
                                    🔍
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search by job, company or location..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    style={styles.searchInput}
                                />

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

                                <option value="APPLIED">
                                    Applied
                                </option>

                                <option value="SHORTLISTED">
                                    Shortlisted
                                </option>

                                <option value="SELECTED">
                                    Selected
                                </option>

                                <option value="REJECTED">
                                    Rejected
                                </option>

                                <option value="INTERVIEW">
                                    Interview
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {loading && (

                            <div style={styles.loadingBox}>

                                <div style={styles.spinner}>
                                </div>

                                <p>
                                    Loading your applications...
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && !loading && (

                            <div style={styles.errorBox}>
                                ⚠️ {error}
                            </div>

                        )}


                        {/* =================================================
                            EMPTY
                        ================================================= */}

                        {!loading &&
                            !error &&
                            filteredApplications.length === 0 && (

                                <div style={styles.emptyBox}>

                                    <div style={styles.emptyIcon}>
                                        📂
                                    </div>

                                    <h2>
                                        {applications.length === 0
                                            ? "No Applications Yet"
                                            : "No Applications Found"}
                                    </h2>

                                    <p>
                                        {applications.length === 0
                                            ? "Start exploring jobs and submit your first application."
                                            : "Try changing your search or status filter."}
                                    </p>


                                    <button
                                        style={styles.browseButton}
                                        onClick={() =>
                                            navigate("/jobs")
                                        }
                                    >
                                        Browse Jobs
                                    </button>

                                </div>

                            )}


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        {!loading &&
                            !error &&
                            filteredApplications.length > 0 && (

                                <div style={styles.tableWrapper}>

                                    <table style={styles.table}>

                                        <thead>

                                            <tr>

                                                <th style={styles.th}>
                                                    JOB
                                                </th>

                                                <th style={styles.th}>
                                                    COMPANY
                                                </th>

                                                <th style={styles.th}>
                                                    LOCATION
                                                </th>

                                                <th style={styles.th}>
                                                    SALARY
                                                </th>

                                                <th style={styles.th}>
                                                    STATUS
                                                </th>

                                                <th style={styles.th}>
                                                    RESUME
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {filteredApplications.map(
                                                application => {

                                                    const job =
                                                        application.job;

                                                    return (

                                                        <tr
                                                            key={
                                                                application.id
                                                            }
                                                            style={
                                                                styles.tableRow
                                                            }
                                                        >

                                                            {/* JOB */}

                                                            <td style={styles.td}>

                                                                <div
                                                                    style={
                                                                        styles.jobCell
                                                                    }
                                                                >

                                                                    <div
                                                                        style={
                                                                            styles.jobIcon
                                                                        }
                                                                    >
                                                                        💼
                                                                    </div>

                                                                    <div>

                                                                        <strong
                                                                            style={
                                                                                styles.jobTitle
                                                                            }
                                                                        >
                                                                            {
                                                                                job?.jobTitle ||
                                                                                "Job"
                                                                            }
                                                                        </strong>

                                                                        <span
                                                                            style={
                                                                                styles.applicationId
                                                                            }
                                                                        >
                                                                            Application #
                                                                            {
                                                                                application.id
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            {/* COMPANY */}

                                                            <td style={styles.td}>

                                                                <strong>
                                                                    {
                                                                        job?.company ||
                                                                        "Company"
                                                                    }
                                                                </strong>

                                                            </td>


                                                            {/* LOCATION */}

                                                            <td style={styles.td}>

                                                                📍{" "}
                                                                {
                                                                    job?.location ||
                                                                    "Not specified"
                                                                }

                                                            </td>


                                                            {/* SALARY */}

                                                            <td style={styles.td}>

                                                                {job?.salary !==
                                                                    null &&
                                                                job?.salary !==
                                                                    undefined
                                                                    ? `₹${job.salary}`
                                                                    : "Not specified"}

                                                            </td>


                                                            {/* STATUS */}

                                                            <td style={styles.td}>

                                                                <span
                                                                    style={
                                                                        getStatusClass(
                                                                            application.status
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        application.status ||
                                                                        "UNKNOWN"
                                                                    }
                                                                </span>

                                                            </td>


                                                            {/* RESUME */}

                                                            <td style={styles.td}>

                                                                {application.resumePath ? (

                                                                    <span
                                                                        style={
                                                                            styles.resumeUploaded
                                                                        }
                                                                    >
                                                                        ✓ Uploaded
                                                                    </span>

                                                                ) : (

                                                                    <span
                                                                        style={
                                                                            styles.resumeMissing
                                                                        }
                                                                    >
                                                                        Not Uploaded
                                                                    </span>

                                                                )}

                                                            </td>

                                                        </tr>

                                                    );

                                                }
                                            )}

                                        </tbody>

                                    </table>

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
        backgroundColor: "#f4f7fb",
        fontFamily:
            "Inter, Arial, sans-serif",
        color: "#172033"
    },


    header: {
        height: "72px",
        background:
            "linear-gradient(135deg, #172554, #1e40af)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        boxSizing: "border-box",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.12)"
    },


    brandArea: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    logoIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        backgroundColor: "rgba(255,255,255,0.15)",
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
        opacity: 0.75
    },


    headerActions: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },


    headerButton: {
        backgroundColor: "rgba(255,255,255,0.12)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.18)",
        padding: "9px 15px",
        borderRadius: "8px",
        cursor: "pointer"
    },


    profileButton: {
        backgroundColor: "rgba(255,255,255,0.12)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.18)",
        padding: "9px 15px",
        borderRadius: "8px",
        cursor: "pointer"
    },


    logoutButton: {
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        padding: "9px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },


    layout: {
        display: "flex",
        minHeight:
            "calc(100vh - 72px)"
    },


    sidebar: {
        width: "240px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5eaf2",
        padding: "25px 15px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },


    sidebarSection: {
        width: "100%"
    },


    sidebarLabel: {
        fontSize: "11px",
        fontWeight: "700",
        color: "#94a3b8",
        padding: "0 12px",
        marginBottom: "12px",
        letterSpacing: "0.8px"
    },


    menuButton: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        border: "none",
        backgroundColor: "transparent",
        padding: "12px 14px",
        marginBottom: "5px",
        borderRadius: "9px",
        cursor: "pointer",
        textAlign: "left",
        color: "#475569",
        fontSize: "14px",
        fontWeight: "500"
    },


    activeMenu: {
        backgroundColor: "#eaf1ff",
        color: "#2563eb",
        fontWeight: "700"
    },


    sidebarBottom: {
        marginTop: "30px"
    },


    helpCard: {
        background:
            "linear-gradient(135deg,#eff6ff,#f5f3ff)",
        borderRadius: "12px",
        padding: "15px",
        fontSize: "13px"
    },


    helpIcon: {
        fontSize: "20px",
        marginBottom: "8px"
    },


    main: {
        flex: 1,
        padding: "32px",
        overflowX: "hidden"
    },


    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "28px",
        gap: "20px"
    },


    breadcrumb: {
        color: "#64748b",
        fontSize: "12px",
        marginBottom: "8px"
    },


    pageTitle: {
        margin: 0,
        fontSize: "30px",
        fontWeight: "750"
    },


    subtitle: {
        marginTop: "8px",
        color: "#64748b",
        fontSize: "14px"
    },


    findJobButton: {
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "600",
        whiteSpace: "nowrap",
        boxShadow:
            "0 5px 12px rgba(37,99,235,0.2)"
    },


    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, minmax(0,1fr))",
        gap: "18px",
        marginBottom: "25px"
    },


    statCard: {
        backgroundColor: "white",
        border: "1px solid #e7ebf2",
        borderRadius: "13px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
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
        fontSize: "20px"
    },


    statLabel: {
        color: "#64748b",
        fontSize: "12px"
    },


    statNumber: {
        margin: "4px 0 0",
        fontSize: "25px"
    },


    applicationSection: {
        backgroundColor: "white",
        border: "1px solid #e7ebf2",
        borderRadius: "14px",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.04)",
        overflow: "hidden"
    },


    toolbar: {
        padding: "18px 20px",
        display: "flex",
        justifyContent: "space-between",
        gap: "15px",
        borderBottom: "1px solid #edf0f5"
    },


    searchBox: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #dce2eb",
        borderRadius: "9px",
        padding: "0 12px",
        width: "420px",
        backgroundColor: "#f8fafc"
    },


    searchIcon: {
        fontSize: "14px"
    },


    searchInput: {
        width: "100%",
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        padding: "11px",
        fontSize: "13px"
    },


    filterSelect: {
        border: "1px solid #dce2eb",
        borderRadius: "9px",
        padding: "10px 14px",
        backgroundColor: "white",
        outline: "none",
        cursor: "pointer",
        color: "#475569"
    },


    tableWrapper: {
        width: "100%",
        overflowX: "auto"
    },


    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "950px"
    },


    th: {
        textAlign: "left",
        padding: "15px 18px",
        backgroundColor: "#f8fafc",
        color: "#64748b",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.5px",
        borderBottom: "1px solid #e5e7eb"
    },


    td: {
        padding: "17px 18px",
        borderBottom: "1px solid #edf0f5",
        fontSize: "13px",
        color: "#475569"
    },


    tableRow: {
        transition: "background-color 0.2s"
    },


    jobCell: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    jobIcon: {
        width: "38px",
        height: "38px",
        borderRadius: "9px",
        backgroundColor: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },


    jobTitle: {
        display: "block",
        color: "#172033",
        marginBottom: "4px"
    },


    applicationId: {
        display: "block",
        color: "#94a3b8",
        fontSize: "11px"
    },


    statusApplied: {
        backgroundColor: "#fef3c7",
        color: "#92400e",
        padding: "6px 11px",
        borderRadius: "20px",
        fontWeight: "700",
        fontSize: "11px"
    },


    statusShortlisted: {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        padding: "6px 11px",
        borderRadius: "20px",
        fontWeight: "700",
        fontSize: "11px"
    },


    statusRejected: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "6px 11px",
        borderRadius: "20px",
        fontWeight: "700",
        fontSize: "11px"
    },


    statusSelected: {
        backgroundColor: "#dcfce7",
        color: "#166534",
        padding: "6px 11px",
        borderRadius: "20px",
        fontWeight: "700",
        fontSize: "11px"
    },


    statusInterview: {
        backgroundColor: "#ede9fe",
        color: "#6d28d9",
        padding: "6px 11px",
        borderRadius: "20px",
        fontWeight: "700",
        fontSize: "11px"
    },


    statusDefault: {
        backgroundColor: "#e5e7eb",
        color: "#374151",
        padding: "6px 11px",
        borderRadius: "20px",
        fontWeight: "700",
        fontSize: "11px"
    },


    resumeUploaded: {
        color: "#16a34a",
        fontWeight: "600",
        fontSize: "12px"
    },


    resumeMissing: {
        color: "#dc2626",
        fontWeight: "600",
        fontSize: "12px"
    },


    loadingBox: {
        padding: "60px",
        textAlign: "center",
        color: "#64748b"
    },


    spinner: {
        width: "28px",
        height: "28px",
        border: "3px solid #dbeafe",
        borderTop:
            "3px solid #2563eb",
        borderRadius: "50%",
        margin: "0 auto 15px",
        animation:
            "spin 1s linear infinite"
    },


    errorBox: {
        margin: "20px",
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "14px",
        borderRadius: "9px"
    },


    emptyBox: {
        padding: "70px 20px",
        textAlign: "center",
        color: "#64748b"
    },


    emptyIcon: {
        fontSize: "45px",
        marginBottom: "10px"
    },


    browseButton: {
        marginTop: "15px",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "11px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    }

};


export default MyApplications;