import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function RecruiterApplicants() {

    const navigate = useNavigate();
    const { jobId } = useParams();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [viewLoading, setViewLoading] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(null);


    // =========================================================
    // LOAD APPLICANTS
    // =========================================================

    useEffect(() => {

        loadApplicants();

    }, [jobId]);


    const loadApplicants = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {

                navigate("/login");
                return;
            }


            let url;

            if (jobId) {

                url =
                    `http://localhost:8085/api/applications/job/${jobId}`;

            } else {

                url =
                    "http://localhost:8085/api/applications/all";
            }


            const response =
                await axios.get(
                    url,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            console.log(
                "Applicants:",
                response.data
            );


            setApplications(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );


        } catch (err) {

            console.error(
                "Applicants error:",
                err
            );

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("role");

                navigate("/login");

            } else {

                setError(
                    "Unable to load applicants."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // VIEW RESUME
    // =========================================================

    const viewResume = async (
        applicationId
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            setViewLoading(
                applicationId
            );


            const response =
                await axios.get(
                    `http://localhost:8085/api/applications/${applicationId}/resume`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        },
                        responseType: "blob"
                    }
                );


            const fileURL =
                window.URL.createObjectURL(
                    response.data
                );


            window.open(
                fileURL,
                "_blank"
            );


        } catch (err) {

            console.error(
                "Resume error:",
                err
            );

            alert(
                "Unable to open resume."
            );

        } finally {

            setViewLoading(null);
        }
    };


    // =========================================================
    // UPDATE STATUS
    // =========================================================

    const updateStatus = async (
        applicationId,
        status
    ) => {

        const application =
            applications.find(
                app =>
                    app.id === applicationId
            );


        if (!application) {
            return;
        }


        if (!application.resumePath) {

            alert(
                "Candidate has not uploaded a resume."
            );

            return;
        }


        const message =
            status === "SHORTLISTED"
                ? "Do you want to shortlist this candidate?"
                : "Do you want to reject this candidate?";


        if (!window.confirm(message)) {
            return;
        }


        try {

            const token =
                localStorage.getItem("token");

            setUpdateLoading(
                applicationId
            );


            const response =
                await axios.put(
                    `http://localhost:8085/api/applications/${applicationId}/status`,
                    {
                        status: status
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


            setApplications(
                previous =>
                    previous.map(
                        app =>
                            app.id === applicationId
                                ? {
                                    ...app,
                                    status:
                                        response.data.status
                                }
                                : app
                    )
            );


        } catch (err) {

            console.error(
                "Status error:",
                err
            );

            alert(
                err.response?.data ||
                "Unable to update application."
            );

        } finally {

            setUpdateLoading(null);
        }
    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };


    // =========================================================
    // FILTER
    // =========================================================

    const filteredApplications =
        applications.filter(
            application => {

                const email =
                    application.candidateEmail
                        ?.toLowerCase() || "";

                const searchMatch =
                    email.includes(
                        search.toLowerCase()
                    );


                const status =
                    application.status ||
                    "APPLIED";


                const statusMatch =
                    statusFilter === "ALL" ||
                    status === statusFilter;


                return (
                    searchMatch &&
                    statusMatch
                );
            }
        );


    // =========================================================
    // STATISTICS
    // =========================================================

    const total =
        applications.length;

    const applied =
        applications.filter(
            a =>
                !a.status ||
                a.status === "APPLIED"
        ).length;

    const shortlisted =
        applications.filter(
            a =>
                a.status === "SHORTLISTED"
        ).length;

    const rejected =
        applications.filter(
            a =>
                a.status === "REJECTED"
        ).length;


    // =========================================================
    // UI
    // =========================================================

    return (

        <div style={styles.page}>

            {/* HEADER */}

            <header style={styles.header}>

                <div style={styles.logoArea}>

                    <div style={styles.logo}>
                        RP
                    </div>

                    <div>
                        <div style={styles.brand}>
                            Recruitment Portal
                        </div>

                        <div style={styles.brandSub}>
                            Recruiter Workspace
                        </div>
                    </div>

                </div>


                <div style={styles.headerRight}>

                    <span style={styles.recruiterText}>
                        Recruiter
                    </span>

                    <button
                        style={styles.logout}
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            <div style={styles.body}>

                {/* SIDEBAR */}

                <aside style={styles.sidebar}>

                    <div style={styles.sidebarTitle}>
                        RECRUITER
                    </div>


                    <button
                        style={styles.menu}
                        onClick={() =>
                            navigate(
                                "/recruiter-dashboard"
                            )
                        }
                    >
                        <span>▦</span>
                        Dashboard
                    </button>


                    <button
                        style={styles.menu}
                        onClick={() =>
                            navigate(
                                "/recruiter-jobs"
                            )
                        }
                    >
                        <span>💼</span>
                        Jobs
                    </button>


                    <button
                        style={styles.activeMenu}
                    >
                        <span>👥</span>
                        Applicants
                    </button>


                    <button
                        style={styles.menu}
                        onClick={() =>
                            navigate(
                                "/recruiter-interviews"
                            )
                        }
                    >
                        <span>📅</span>
                        Interviews
                    </button>


                    <div style={styles.sidebarBottom}>

                        <button
                            style={styles.menu}
                            onClick={() =>
                                navigate(
                                    "/recruiter-profile"
                                )
                            }
                        >
                            <span>👤</span>
                            Profile
                        </button>

                    </div>

                </aside>


                {/* MAIN */}

                <main style={styles.main}>

                    {/* TITLE */}

                    <div style={styles.pageTitle}>

                        <div>

                            <h1 style={styles.title}>
                                Applicants
                            </h1>

                            <p style={styles.subtitle}>
                                Manage and review candidates
                                who applied for your jobs.
                            </p>

                        </div>


                        <button
                            style={styles.refreshButton}
                            onClick={loadApplicants}
                        >
                            ↻ Refresh
                        </button>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div style={styles.error}>
                            {error}
                        </div>

                    )}


                    {/* STAT CARDS */}

                    <div style={styles.stats}>

                        <div style={styles.statCard}>

                            <div style={styles.statIconBlue}>
                                👥
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    Total Applicants
                                </div>

                                <div style={styles.statValue}>
                                    {total}
                                </div>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div style={styles.statIconYellow}>
                                ⏳
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    Applied
                                </div>

                                <div style={styles.statValue}>
                                    {applied}
                                </div>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div style={styles.statIconGreen}>
                                ✓
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    Shortlisted
                                </div>

                                <div style={styles.statValue}>
                                    {shortlisted}
                                </div>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div style={styles.statIconRed}>
                                ✕
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    Rejected
                                </div>

                                <div style={styles.statValue}>
                                    {rejected}
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* TABLE CARD */}

                    <div style={styles.tableCard}>

                        {/* TABLE HEADER */}

                        <div style={styles.tableHeader}>

                            <div>

                                <h2 style={styles.tableTitle}>
                                    Candidate Applications
                                </h2>

                                <p style={styles.tableSubtitle}>
                                    {filteredApplications.length}
                                    {" "}candidates found
                                </p>

                            </div>


                            <div style={styles.filters}>

                                <input
                                    type="text"
                                    placeholder="Search candidate email..."
                                    value={search}
                                    onChange={
                                        e =>
                                            setSearch(
                                                e.target.value
                                            )
                                    }
                                    style={styles.search}
                                />


                                <select
                                    value={statusFilter}
                                    onChange={
                                        e =>
                                            setStatusFilter(
                                                e.target.value
                                            )
                                    }
                                    style={styles.select}
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

                                    <option value="REJECTED">
                                        Rejected
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* LOADING */}

                        {loading && (

                            <div style={styles.loading}>
                                Loading applicants...
                            </div>

                        )}


                        {/* EMPTY */}

                        {!loading &&
                            filteredApplications.length === 0 && (

                                <div style={styles.empty}>

                                    <div style={styles.emptyIcon}>
                                        👥
                                    </div>

                                    <h3>
                                        No Applicants Found
                                    </h3>

                                    <p>
                                        There are no candidate
                                        applications to display.
                                    </p>

                                </div>

                            )}


                        {/* TABLE */}

                        {!loading &&
                            filteredApplications.length > 0 && (

                                <div style={styles.tableWrapper}>

                                    <table style={styles.table}>

                                        <thead>

                                            <tr>

                                                <th style={styles.th}>
                                                    #
                                                </th>

                                                <th style={styles.th}>
                                                    Candidate
                                                </th>

                                                <th style={styles.th}>
                                                    Job
                                                </th>

                                                <th style={styles.th}>
                                                    Resume
                                                </th>

                                                <th style={styles.th}>
                                                    Status
                                                </th>

                                                <th style={styles.th}>
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {filteredApplications.map(
                                                (application, index) => (

                                                    <tr
                                                        key={
                                                            application.id
                                                        }
                                                        style={
                                                            styles.tr
                                                        }
                                                    >

                                                        {/* NUMBER */}

                                                        <td style={styles.td}>
                                                            <span
                                                                style={
                                                                    styles.number
                                                                }
                                                            >
                                                                {index + 1}
                                                            </span>
                                                        </td>


                                                        {/* CANDIDATE */}

                                                        <td style={styles.td}>

                                                            <div style={styles.candidate}>

                                                                <div
                                                                    style={
                                                                        styles.avatar
                                                                    }
                                                                >
                                                                    {(
                                                                        application
                                                                            .candidateEmail ||
                                                                        "C"
                                                                    )
                                                                        .charAt(0)
                                                                        .toUpperCase()}
                                                                </div>

                                                                <div>

                                                                    <div
                                                                        style={
                                                                            styles.emailText
                                                                        }
                                                                    >
                                                                        {
                                                                            application.candidateEmail
                                                                        }
                                                                    </div>

                                                                    <div
                                                                        style={
                                                                            styles.applicationId
                                                                        }
                                                                    >
                                                                        Application #
                                                                        {
                                                                            application.id
                                                                        }
                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* JOB */}

                                                        <td style={styles.td}>

                                                            <div
                                                                style={
                                                                    styles.jobName
                                                                }
                                                            >
                                                                {
                                                                    application.job?.title ||
                                                                    "Job Application"
                                                                }
                                                            </div>

                                                        </td>


                                                        {/* RESUME */}

                                                        <td style={styles.td}>

                                                            {application.resumePath ? (

                                                                <button
                                                                    style={
                                                                        styles.resumeButton
                                                                    }
                                                                    disabled={
                                                                        viewLoading ===
                                                                        application.id
                                                                    }
                                                                    onClick={() =>
                                                                        viewResume(
                                                                            application.id
                                                                        )
                                                                    }
                                                                >
                                                                    📄{" "}
                                                                    {viewLoading ===
                                                                    application.id
                                                                        ? "Opening..."
                                                                        : "View Resume"}
                                                                </button>

                                                            ) : (

                                                                <span
                                                                    style={
                                                                        styles.noResume
                                                                    }
                                                                >
                                                                    Not uploaded
                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* STATUS */}

                                                        <td style={styles.td}>

                                                            <span
                                                                style={
                                                                    getStatusStyle(
                                                                        application.status
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    application.status ||
                                                                    "APPLIED"
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* ACTIONS */}

                                                        <td style={styles.td}>

                                                            <div
                                                                style={
                                                                    styles.actionGroup
                                                                }
                                                            >

                                                                <button
                                                                    style={
                                                                        application.resumePath
                                                                            ? styles.shortlist
                                                                            : styles.disabled
                                                                    }
                                                                    disabled={
                                                                        !application.resumePath ||
                                                                        updateLoading ===
                                                                        application.id
                                                                    }
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            application.id,
                                                                            "SHORTLISTED"
                                                                        )
                                                                    }
                                                                >
                                                                    ✓
                                                                </button>


                                                                <button
                                                                    style={
                                                                        application.resumePath
                                                                            ? styles.reject
                                                                            : styles.disabled
                                                                    }
                                                                    disabled={
                                                                        !application.resumePath ||
                                                                        updateLoading ===
                                                                        application.id
                                                                    }
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            application.id,
                                                                            "REJECTED"
                                                                        )
                                                                    }
                                                                >
                                                                    ✕
                                                                </button>


                                                                <button
                                                                    style={
                                                                        styles.interview
                                                                    }
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/recruiter-interviews/${application.id}`
                                                                        )
                                                                    }
                                                                >
                                                                    📅
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                    </div>

                </main>

            </div>

        </div>
    );
}


// =========================================================
// STATUS STYLE
// =========================================================

const getStatusStyle = (status) => {

    if (status === "SHORTLISTED") {

        return {
            ...styles.status,
            backgroundColor: "#dcfce7",
            color: "#15803d"
        };
    }

    if (status === "REJECTED") {

        return {
            ...styles.status,
            backgroundColor: "#fee2e2",
            color: "#dc2626"
        };
    }

    return {
        ...styles.status,
        backgroundColor: "#dbeafe",
        color: "#2563eb"
    };
};


// =========================================================
// STYLES
// =========================================================

const styles = {

    page: {
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        fontFamily:
            "'Inter', 'Segoe UI', Arial, sans-serif",
        color: "#1e293b"
    },

    header: {
        height: "68px",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        boxSizing: "border-box"
    },

    logoArea: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },

    logo: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        backgroundColor: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "15px"
    },

    brand: {
        fontSize: "17px",
        fontWeight: "700"
    },

    brandSub: {
        fontSize: "11px",
        color: "#94a3b8",
        marginTop: "2px"
    },

    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "18px"
    },

    recruiterText: {
        color: "#cbd5e1",
        fontSize: "14px"
    },

    logout: {
        border: "1px solid #475569",
        backgroundColor: "transparent",
        color: "white",
        padding: "8px 17px",
        borderRadius: "7px",
        cursor: "pointer"
    },

    body: {
        display: "flex",
        minHeight: "calc(100vh - 68px)"
    },

    sidebar: {
        width: "235px",
        backgroundColor: "white",
        borderRight: "1px solid #e2e8f0",
        padding: "25px 14px",
        boxSizing: "border-box"
    },

    sidebarTitle: {
        fontSize: "11px",
        fontWeight: "700",
        color: "#94a3b8",
        letterSpacing: "1px",
        padding: "0 13px",
        marginBottom: "14px"
    },

    menu: {
        width: "100%",
        border: "none",
        backgroundColor: "transparent",
        color: "#475569",
        padding: "12px 14px",
        borderRadius: "8px",
        marginBottom: "5px",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "14px",
        display: "flex",
        gap: "12px",
        alignItems: "center"
    },

    activeMenu: {
        width: "100%",
        border: "none",
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        padding: "12px 14px",
        borderRadius: "8px",
        marginBottom: "5px",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "700",
        display: "flex",
        gap: "12px",
        alignItems: "center"
    },

    sidebarBottom: {
        marginTop: "25px",
        paddingTop: "15px",
        borderTop: "1px solid #e2e8f0"
    },

    main: {
        flex: 1,
        padding: "32px",
        minWidth: 0
    },

    pageTitle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px"
    },

    title: {
        margin: 0,
        fontSize: "28px",
        fontWeight: "750",
        color: "#0f172a"
    },

    subtitle: {
        margin: "7px 0 0",
        color: "#64748b",
        fontSize: "14px"
    },

    refreshButton: {
        border: "1px solid #cbd5e1",
        backgroundColor: "white",
        color: "#334155",
        padding: "10px 17px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },

    error: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        padding: "13px 17px",
        borderRadius: "8px",
        marginBottom: "20px"
    },

    stats: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
        gap: "18px",
        marginBottom: "25px"
    },

    statCard: {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px"
    },

    statIconBlue: {
        width: "45px",
        height: "45px",
        borderRadius: "10px",
        backgroundColor: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
    },

    statIconYellow: {
        width: "45px",
        height: "45px",
        borderRadius: "10px",
        backgroundColor: "#fefce8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
    },

    statIconGreen: {
        width: "45px",
        height: "45px",
        borderRadius: "10px",
        backgroundColor: "#f0fdf4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
    },

    statIconRed: {
        width: "45px",
        height: "45px",
        borderRadius: "10px",
        backgroundColor: "#fef2f2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
    },

    statLabel: {
        fontSize: "12px",
        color: "#64748b",
        marginBottom: "5px"
    },

    statValue: {
        fontSize: "24px",
        fontWeight: "750",
        color: "#0f172a"
    },

    tableCard: {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden"
    },

    tableHeader: {
        padding: "22px 24px",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap"
    },

    tableTitle: {
        margin: 0,
        fontSize: "17px",
        color: "#0f172a"
    },

    tableSubtitle: {
        margin: "5px 0 0",
        fontSize: "12px",
        color: "#94a3b8"
    },

    filters: {
        display: "flex",
        gap: "10px"
    },

    search: {
        width: "230px",
        padding: "10px 13px",
        border: "1px solid #cbd5e1",
        borderRadius: "7px",
        outline: "none",
        fontSize: "13px"
    },

    select: {
        padding: "10px 13px",
        border: "1px solid #cbd5e1",
        borderRadius: "7px",
        backgroundColor: "white",
        color: "#334155",
        cursor: "pointer"
    },

    tableWrapper: {
        width: "100%",
        overflowX: "auto"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "900px"
    },

    th: {
        textAlign: "left",
        padding: "14px 18px",
        backgroundColor: "#f8fafc",
        color: "#64748b",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        borderBottom: "1px solid #e2e8f0"
    },

    tr: {
        borderBottom: "1px solid #f1f5f9"
    },

    td: {
        padding: "16px 18px",
        verticalAlign: "middle",
        fontSize: "13px"
    },

    number: {
        color: "#94a3b8",
        fontWeight: "600"
    },

    candidate: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },

    avatar: {
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        backgroundColor: "#dbeafe",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700"
    },

    emailText: {
        fontWeight: "600",
        color: "#334155"
    },

    applicationId: {
        fontSize: "11px",
        color: "#94a3b8",
        marginTop: "3px"
    },

    jobName: {
        color: "#475569",
        fontWeight: "500"
    },

    status: {
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700"
    },

    resumeButton: {
        border: "1px solid #c4b5fd",
        backgroundColor: "#f5f3ff",
        color: "#6d28d9",
        padding: "7px 11px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600"
    },

    noResume: {
        color: "#ef4444",
        fontSize: "12px"
    },

    actionGroup: {
        display: "flex",
        gap: "7px"
    },

    shortlist: {
        width: "34px",
        height: "32px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#dcfce7",
        color: "#15803d",
        cursor: "pointer",
        fontWeight: "700"
    },

    reject: {
        width: "34px",
        height: "32px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        cursor: "pointer",
        fontWeight: "700"
    },

    interview: {
        width: "34px",
        height: "32px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#dbeafe",
        color: "#2563eb",
        cursor: "pointer"
    },

    disabled: {
        width: "34px",
        height: "32px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#e2e8f0",
        color: "#94a3b8",
        cursor: "not-allowed"
    },

    loading: {
        padding: "60px",
        textAlign: "center",
        color: "#64748b"
    },

    empty: {
        padding: "70px 20px",
        textAlign: "center",
        color: "#64748b"
    },

    emptyIcon: {
        fontSize: "45px",
        marginBottom: "10px"
    }
};


export default RecruiterApplicants;