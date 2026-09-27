import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Jobs() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    const [selectedFiles, setSelectedFiles] = useState({});
    const [applyingJobId, setApplyingJobId] = useState(null);

    const token = localStorage.getItem("token");


    // =========================================================
    // LOAD JOBS
    // =========================================================

    useEffect(() => {

        if (!token) {
            navigate("/login");
            return;
        }

        loadJobs();

    }, []);


    const loadJobs = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                "http://localhost:8085/api/jobs/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setJobs(response.data || []);

        } catch (error) {

            console.error("Error loading jobs:", error);

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


    // =========================================================
    // SEARCH + FILTER
    // =========================================================

    const filteredJobs = useMemo(() => {

        const searchValue =
            search.toLowerCase().trim();

        const locationValue =
            locationFilter.toLowerCase().trim();


        return jobs.filter((job) => {

            const title =
                job.jobTitle?.toLowerCase() || "";

            const company =
                job.company?.toLowerCase() || "";

            const location =
                job.location?.toLowerCase() || "";

            const skills =
                job.skills?.toLowerCase() || "";


            const matchesSearch =
                !searchValue ||
                title.includes(searchValue) ||
                company.includes(searchValue) ||
                location.includes(searchValue) ||
                skills.includes(searchValue);


            const matchesLocation =
                !locationValue ||
                location.includes(locationValue);


            return (
                matchesSearch &&
                matchesLocation
            );

        });

    }, [
        jobs,
        search,
        locationFilter
    ]);


    // =========================================================
    // RESUME SELECT
    // =========================================================

    const handleFileChange = (jobId, file) => {

        if (!file) {
            return;
        }


        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];


        if (!allowedTypes.includes(file.type)) {

            alert(
                "Please upload a PDF, DOC or DOCX resume."
            );

            return;
        }


        if (file.size > 5 * 1024 * 1024) {

            alert(
                "Resume size must be less than 5 MB."
            );

            return;
        }


        setSelectedFiles((previous) => ({
            ...previous,
            [jobId]: file
        }));

    };


    // =========================================================
    // APPLY JOB
    // =========================================================

    const handleApply = async (jobId) => {

        const file =
            selectedFiles[jobId];


        if (!file) {

            alert(
                "Please upload your resume before applying."
            );

            return;
        }


        try {

            setApplyingJobId(jobId);


            const formData =
                new FormData();

            formData.append(
                "jobId",
                jobId
            );

            formData.append(
                "file",
                file
            );


            const response =
                await axios.post(

                    "http://localhost:8085/api/applications/apply",

                    formData,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            alert(
                response.data ||
                "Application submitted successfully."
            );


            setSelectedFiles(
                (previous) => {

                    const updated =
                        { ...previous };

                    delete updated[jobId];

                    return updated;
                }
            );


            await loadJobs();


        } catch (error) {

            console.error(
                "Apply error:",
                error
            );


            alert(
                error.response?.data ||
                "Unable to apply for this job."
            );


        } finally {

            setApplyingJobId(null);
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
    // CLEAR FILTERS
    // =========================================================

    const clearFilters = () => {

        setSearch("");
        setLocationFilter("");
    };


    // =========================================================
    // DEADLINE STYLE
    // =========================================================

    const getDeadlineStyle = (deadline) => {

        if (!deadline) {

            return {
                ...styles.deadline,
                backgroundColor: "#f1f5f9",
                color: "#64748b"
            };
        }


        const today =
            new Date();

        const deadlineDate =
            new Date(deadline);


        const difference =
            Math.ceil(
                (
                    deadlineDate -
                    today
                ) /
                (1000 * 60 * 60 * 24)
            );


        if (difference < 0) {

            return {
                ...styles.deadline,
                backgroundColor: "#fee2e2",
                color: "#b91c1c"
            };

        }


        if (difference <= 3) {

            return {
                ...styles.deadline,
                backgroundColor: "#fef3c7",
                color: "#b45309"
            };

        }


        return {
            ...styles.deadline,
            backgroundColor: "#dcfce7",
            color: "#15803d"
        };

    };


    // =========================================================
    // DEADLINE TEXT
    // =========================================================

    const getDeadlineText = (deadline) => {

        if (!deadline) {
            return "Not specified";
        }


        const today =
            new Date();

        const deadlineDate =
            new Date(deadline);


        const difference =
            Math.ceil(
                (
                    deadlineDate -
                    today
                ) /
                (1000 * 60 * 60 * 24)
            );


        if (difference < 0) {
            return "Expired";
        }


        if (difference === 0) {
            return "Today";
        }


        if (difference === 1) {
            return "Tomorrow";
        }


        return `${difference} days left`;
    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        const d =
            new Date(date);


        if (isNaN(d.getTime())) {
            return date;
        }


        return d.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div style={styles.container}>


            {/* =================================================
                HEADER
            ================================================= */}

            <header style={styles.header}>

                <div style={styles.headerLeft}>

                    <div style={styles.logoIcon}>
                        RP
                    </div>

                    <div>

                        <div style={styles.logoText}>
                            Recruitment Portal
                        </div>

                        <div style={styles.logoSubText}>
                            Candidate Workspace
                        </div>

                    </div>

                </div>


                <div style={styles.headerRight}>

                    <div style={styles.userBadge}>

                        <div style={styles.userCircle}>
                            C
                        </div>

                        <span>
                            Candidate
                        </span>

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


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside style={styles.sidebar}>

                    <div style={styles.sidebarSectionTitle}>
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

                        <span style={styles.menuIcon}>
                            🏠
                        </span>

                        Dashboard

                    </button>


                    <button
                        style={{
                            ...styles.menuButton,
                            ...styles.activeMenuButton
                        }}
                    >

                        <span style={styles.menuIcon}>
                            💼
                        </span>

                        Find Jobs

                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/my-applications"
                            )
                        }
                    >

                        <span style={styles.menuIcon}>
                            📄
                        </span>

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

                        <span style={styles.menuIcon}>
                            📅
                        </span>

                        Interviews

                    </button>


                    <div style={styles.sidebarDivider}></div>


                    <div style={styles.sidebarSectionTitle}>
                        ACCOUNT
                    </div>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/profile"
                            )
                        }
                    >

                        <span style={styles.menuIcon}>
                            👤
                        </span>

                        My Profile

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
                                Candidate / Find Jobs
                            </div>

                            <h1 style={styles.pageTitle}>
                                Find Your Next Opportunity
                            </h1>

                            <p style={styles.pageSubtitle}>
                                Explore available opportunities
                                and apply with your resume.
                            </p>

                        </div>


                        <div style={styles.jobCountBadge}>

                            <span style={styles.countNumber}>
                                {filteredJobs.length}
                            </span>

                            Jobs

                        </div>

                    </div>


                    {/* =================================================
                        SEARCH PANEL
                    ================================================= */}

                    <div style={styles.searchPanel}>


                        {/* SEARCH */}

                        <div style={styles.searchBox}>

                            <span style={styles.searchIcon}>
                                🔎
                            </span>

                            <input
                                type="text"
                                placeholder="Search job title, company or skills..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                style={styles.searchInput}
                            />

                        </div>


                        {/* LOCATION */}

                        <div style={styles.locationBox}>

                            <span style={styles.locationIcon}>
                                📍
                            </span>

                            <input
                                type="text"
                                placeholder="Location"
                                value={locationFilter}
                                onChange={(e) =>
                                    setLocationFilter(
                                        e.target.value
                                    )
                                }
                                style={styles.locationInput}
                            />

                        </div>


                        {/* SEARCH */}

                        <button
                            style={styles.searchButton}
                            onClick={() => {}}
                        >
                            Search
                        </button>


                        {/* CLEAR */}

                        {(search ||
                            locationFilter) && (

                            <button
                                style={styles.clearSearchButton}
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear
                            </button>

                        )}

                    </div>


                    {/* =================================================
                        FILTER INFORMATION
                    ================================================= */}

                    <div style={styles.filterRow}>

                        <div style={styles.resultText}>

                            Showing{" "}

                            <strong>
                                {filteredJobs.length}
                            </strong>

                            {" "}of{" "}

                            <strong>
                                {jobs.length}
                            </strong>

                            {" "}available jobs

                        </div>


                        <div style={styles.liveIndicator}>

                            <span
                                style={
                                    styles.liveDot
                                }
                            ></span>

                            Live Opportunities

                        </div>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div style={styles.loadingBox}>

                            <div style={styles.spinner}>
                                ⟳
                            </div>

                            <h3>
                                Loading Jobs
                            </h3>

                            <p>
                                Finding the latest
                                opportunities for you...
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        EMPTY
                    ================================================= */}

                    {!loading &&
                        filteredJobs.length === 0 && (

                            <div style={styles.emptyBox}>

                                <div style={styles.emptyIcon}>
                                    🔍
                                </div>

                                <h2>
                                    No Jobs Found
                                </h2>

                                <p>
                                    Try changing your
                                    search or location filter.
                                </p>

                                <button
                                    style={
                                        styles.primaryButton
                                    }
                                    onClick={
                                        clearFilters
                                    }
                                >
                                    View All Jobs
                                </button>

                            </div>

                        )}


                    {/* =================================================
                        JOB TABLE
                    ================================================= */}

                    {!loading &&
                        filteredJobs.length > 0 && (

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
                                                SKILLS
                                            </th>

                                            <th style={styles.th}>
                                                DEADLINE
                                            </th>

                                            <th style={styles.th}>
                                                RESUME
                                            </th>

                                            <th style={styles.th}>
                                                ACTION
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredJobs.map(
                                            (job) => (

                                                <tr
                                                    key={job.id}
                                                    style={styles.tableRow}
                                                >


                                                    {/* JOB */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                styles.jobCell
                                                            }
                                                        >

                                                            <div
                                                                style={
                                                                    styles.companyLogo
                                                                }
                                                            >

                                                                {(
                                                                    job.company ||
                                                                    "C"
                                                                )
                                                                    .charAt(0)
                                                                    .toUpperCase()}

                                                            </div>


                                                            <div>

                                                                <div
                                                                    style={
                                                                        styles.jobTitle
                                                                    }
                                                                >

                                                                    {job.jobTitle ||
                                                                        "Job Position"}

                                                                </div>


                                                                <div
                                                                    style={
                                                                        styles.jobDate
                                                                    }
                                                                >

                                                                    Posted
                                                                    opportunity

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* COMPANY */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <strong
                                                            style={
                                                                styles.companyName
                                                            }
                                                        >

                                                            {job.company ||
                                                                "Company"}

                                                        </strong>

                                                    </td>


                                                    {/* LOCATION */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                styles.locationText
                                                            }
                                                        >

                                                            📍

                                                            {" "}

                                                            {job.location ||
                                                                "Not specified"}

                                                        </div>

                                                    </td>


                                                    {/* SALARY */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <span
                                                            style={
                                                                styles.salary
                                                            }
                                                        >

                                                            {job.salary
                                                                ? `₹${job.salary}`
                                                                : "Not specified"}

                                                        </span>

                                                    </td>


                                                    {/* SKILLS */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                styles.skillsContainer
                                                            }
                                                        >

                                                            {job.skills
                                                                ? job.skills
                                                                    .split(",")
                                                                    .slice(
                                                                        0,
                                                                        3
                                                                    )
                                                                    .map(
                                                                        (
                                                                            skill,
                                                                            index
                                                                        ) => (

                                                                            <span
                                                                                key={
                                                                                    index
                                                                                }
                                                                                style={
                                                                                    styles.skillTag
                                                                                }
                                                                            >

                                                                                {
                                                                                    skill.trim()
                                                                                }

                                                                            </span>

                                                                        )
                                                                    )
                                                                : (

                                                                    <span
                                                                        style={
                                                                            styles.noData
                                                                        }
                                                                    >
                                                                        No skills
                                                                    </span>

                                                                )}

                                                        </div>

                                                    </td>


                                                    {/* DEADLINE */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                getDeadlineStyle(
                                                                    job.applicationDeadline
                                                                )
                                                            }
                                                        >

                                                            <div>
                                                                ⏰
                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        formatDate(
                                                                            job.applicationDeadline
                                                                        )
                                                                    }
                                                                </strong>

                                                                <small>
                                                                    {
                                                                        getDeadlineText(
                                                                            job.applicationDeadline
                                                                        )
                                                                    }
                                                                </small>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* RESUME */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                styles.resumeCell
                                                            }
                                                        >

                                                            <label
                                                                style={
                                                                    styles.uploadButton
                                                                }
                                                            >

                                                                📎 Choose

                                                                <input
                                                                    type="file"
                                                                    accept=".pdf,.doc,.docx"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleFileChange(
                                                                            job.id,
                                                                            e
                                                                                .target
                                                                                .files[0]
                                                                        )
                                                                    }
                                                                    style={
                                                                        styles.hiddenFile
                                                                    }
                                                                />

                                                            </label>


                                                            {selectedFiles[
                                                                job.id
                                                            ] && (

                                                                <div
                                                                    style={
                                                                        styles.selectedFile
                                                                    }
                                                                >

                                                                    ✓{" "}

                                                                    {
                                                                        selectedFiles[
                                                                            job.id
                                                                        ].name
                                                                    }

                                                                </div>

                                                            )}

                                                        </div>

                                                    </td>


                                                    {/* ACTION */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <button
                                                            style={
                                                                selectedFiles[
                                                                    job.id
                                                                ]
                                                                    ? styles.applyButton
                                                                    : styles.disabledButton
                                                            }
                                                            disabled={
                                                                !selectedFiles[
                                                                    job.id
                                                                ] ||
                                                                applyingJobId ===
                                                                job.id
                                                            }
                                                            onClick={() =>
                                                                handleApply(
                                                                    job.id
                                                                )
                                                            }
                                                        >

                                                            {applyingJobId ===
                                                                job.id
                                                                ? "Applying..."
                                                                : "Apply →"}

                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                </main>

            </div>

        </div>
    );
}


// =========================================================
// STYLES
// =========================================================

const styles = {

    // =========================================================
    // CONTAINER
    // =========================================================

    container: {

        minHeight: "100vh",

        background:
            "linear-gradient(135deg,#f8fafc,#eef4ff)",

        fontFamily:
            "'Inter','Segoe UI',Arial,sans-serif",

        color: "#172033"
    },


    // =========================================================
    // HEADER
    // =========================================================

    header: {

        height: "72px",

        background:
            "linear-gradient(135deg,#0f172a,#1e3a8a,#4338ca)",

        color: "white",

        display: "flex",

        alignItems: "center",

        justifyContent:
            "space-between",

        padding: "0 30px",

        boxSizing: "border-box",

        boxShadow:
            "0 5px 25px rgba(30,58,138,0.25)"
    },


    headerLeft: {

        display: "flex",

        alignItems: "center",

        gap: "12px"
    },


    logoIcon: {

        width: "43px",

        height: "43px",

        borderRadius: "13px",

        background:
            "linear-gradient(135deg,#38bdf8,#6366f1)",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        fontWeight: "900",

        boxShadow:
            "0 5px 15px rgba(59,130,246,0.35)"
    },


    logoText: {

        fontSize: "18px",

        fontWeight: "800"
    },


    logoSubText: {

        fontSize: "11px",

        color: "#bfdbfe",

        marginTop: "2px"
    },


    headerRight: {

        display: "flex",

        alignItems: "center",

        gap: "18px"
    },


    userBadge: {

        display: "flex",

        alignItems: "center",

        gap: "8px",

        fontSize: "14px",

        fontWeight: "600"
    },


    userCircle: {

        width: "34px",

        height: "34px",

        borderRadius: "50%",

        background:
            "linear-gradient(135deg,#dbeafe,#c7d2fe)",

        color: "#3730a3",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        fontWeight: "800"
    },


    logoutButton: {

        border:
            "1px solid rgba(255,255,255,0.25)",

        backgroundColor:
            "rgba(255,255,255,0.10)",

        color: "white",

        padding: "9px 17px",

        borderRadius: "9px",

        cursor: "pointer",

        fontWeight: "700"
    },


    // =========================================================
    // LAYOUT
    // =========================================================

    layout: {

        display: "flex",

        minHeight:
            "calc(100vh - 72px)"
    },


    // =========================================================
    // SIDEBAR
    // =========================================================

    sidebar: {

        width: "235px",

        backgroundColor: "white",

        padding: "28px 15px",

        boxSizing: "border-box",

        borderRight:
            "1px solid #e5e7eb",

        flexShrink: 0
    },


    sidebarSectionTitle: {

        fontSize: "11px",

        fontWeight: "800",

        color: "#94a3b8",

        letterSpacing: "1px",

        padding: "0 12px",

        marginBottom: "12px"
    },


    menuButton: {

        width: "100%",

        border: "none",

        backgroundColor:
            "transparent",

        color: "#64748b",

        padding: "13px 14px",

        marginBottom: "5px",

        borderRadius: "10px",

        textAlign: "left",

        cursor: "pointer",

        fontSize: "14px",

        fontWeight: "500",

        display: "flex",

        alignItems: "center",

        gap: "12px"
    },


    activeMenuButton: {

        background:
            "linear-gradient(135deg,#eff6ff,#eef2ff)",

        color: "#2563eb",

        fontWeight: "800",

        boxShadow:
            "inset 3px 0 0 #2563eb"
    },


    menuIcon: {

        width: "22px",

        fontSize: "17px"
    },


    sidebarDivider: {

        height: "1px",

        backgroundColor:
            "#e5e7eb",

        margin:
            "22px 8px"
    },


    // =========================================================
    // MAIN
    // =========================================================

    main: {

        flex: 1,

        padding: "35px",

        boxSizing: "border-box",

        minWidth: 0
    },


    pageHeader: {

        display: "flex",

        justifyContent:
            "space-between",

        alignItems: "flex-end",

        marginBottom: "25px"
    },


    breadcrumb: {

        fontSize: "13px",

        color: "#64748b",

        marginBottom: "8px"
    },


    pageTitle: {

        margin: 0,

        fontSize: "30px",

        fontWeight: "800",

        color: "#111827"
    },


    pageSubtitle: {

        margin: "8px 0 0",

        color: "#64748b",

        fontSize: "15px"
    },


    jobCountBadge: {

        display: "flex",

        alignItems: "center",

        gap: "7px",

        background:
            "linear-gradient(135deg,#eff6ff,#eef2ff)",

        color: "#2563eb",

        padding: "10px 17px",

        borderRadius: "20px",

        fontWeight: "700",

        fontSize: "13px"
    },


    countNumber: {

        fontSize: "18px",

        fontWeight: "900"
    },


    // =========================================================
    // SEARCH
    // =========================================================

    searchPanel: {

        backgroundColor: "white",

        border:
            "1px solid #e5e7eb",

        padding: "14px",

        borderRadius: "15px",

        display: "flex",

        gap: "10px",

        boxShadow:
            "0 8px 25px rgba(15,23,42,0.07)",

        marginBottom: "15px"
    },


    searchBox: {

        flex: 1,

        display: "flex",

        alignItems: "center",

        border:
            "1px solid #dbe2ea",

        borderRadius: "10px",

        padding: "0 13px",

        minHeight: "46px"
    },


    searchIcon: {

        fontSize: "17px",

        marginRight: "9px"
    },


    searchInput: {

        width: "100%",

        border: "none",

        outline: "none",

        fontSize: "14px",

        backgroundColor:
            "transparent"
    },


    locationBox: {

        width: "220px",

        display: "flex",

        alignItems: "center",

        border:
            "1px solid #dbe2ea",

        borderRadius: "10px",

        padding: "0 13px"
    },


    locationIcon: {

        fontSize: "16px",

        marginRight: "8px"
    },


    locationInput: {

        width: "100%",

        border: "none",

        outline: "none",

        fontSize: "14px"
    },


    searchButton: {

        background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",

        color: "white",

        border: "none",

        padding: "0 22px",

        borderRadius: "10px",

        cursor: "pointer",

        fontWeight: "800",

        minHeight: "46px"
    },


    clearSearchButton: {

        backgroundColor:
            "#f1f5f9",

        color: "#475569",

        border: "none",

        padding: "0 15px",

        borderRadius: "10px",

        cursor: "pointer",

        fontWeight: "700"
    },


    filterRow: {

        display: "flex",

        justifyContent:
            "space-between",

        alignItems: "center",

        marginBottom: "20px"
    },


    resultText: {

        color: "#64748b",

        fontSize: "13px"
    },


    liveIndicator: {

        display: "flex",

        alignItems: "center",

        gap: "7px",

        color: "#15803d",

        fontSize: "12px",

        fontWeight: "700"
    },


    liveDot: {

        width: "8px",

        height: "8px",

        borderRadius: "50%",

        backgroundColor: "#22c55e",

        boxShadow:
            "0 0 0 4px #dcfce7"
    },


    // =========================================================
    // TABLE
    // =========================================================

    tableWrapper: {

        width: "100%",

        overflowX: "auto",

        backgroundColor: "white",

        border:
            "1px solid #e2e8f0",

        borderRadius: "16px",

        boxShadow:
            "0 8px 30px rgba(15,23,42,0.07)"
    },


    table: {

        width: "100%",

        minWidth: "1250px",

        borderCollapse:
            "separate",

        borderSpacing: 0
    },


    th: {

        background:
            "linear-gradient(135deg,#f8fafc,#f1f5f9)",

        color: "#64748b",

        fontSize: "11px",

        fontWeight: "800",

        letterSpacing: "0.6px",

        textAlign: "left",

        padding: "16px 14px",

        borderBottom:
            "1px solid #e2e8f0",

        whiteSpace: "nowrap"
    },


    td: {

        padding: "16px 14px",

        borderBottom:
            "1px solid #eef2f7",

        verticalAlign: "middle",

        fontSize: "13px"
    },


    tableRow: {

        backgroundColor: "white"
    },


    jobCell: {

        display: "flex",

        alignItems: "center",

        gap: "11px",

        minWidth: "220px"
    },


    companyLogo: {

        width: "42px",

        height: "42px",

        borderRadius: "11px",

        background:
            "linear-gradient(135deg,#dbeafe,#e0e7ff)",

        color: "#2563eb",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        fontSize: "16px",

        fontWeight: "900",

        flexShrink: 0
    },


    jobTitle: {

        color: "#111827",

        fontWeight: "800",

        fontSize: "14px",

        marginBottom: "4px"
    },


    jobDate: {

        color: "#94a3b8",

        fontSize: "11px"
    },


    companyName: {

        color: "#334155",

        fontSize: "13px"
    },


    locationText: {

        color: "#475569",

        whiteSpace: "nowrap"
    },


    salary: {

        color: "#15803d",

        fontWeight: "800",

        whiteSpace: "nowrap"
    },


    // =========================================================
    // SKILLS
    // =========================================================

    skillsContainer: {

        display: "flex",

        gap: "5px",

        flexWrap: "wrap",

        maxWidth: "180px"
    },


    skillTag: {

        background:
            "linear-gradient(135deg,#eff6ff,#eef2ff)",

        color: "#3730a3",

        padding: "5px 8px",

        borderRadius: "6px",

        fontSize: "10px",

        fontWeight: "700",

        whiteSpace: "nowrap"
    },


    noData: {

        color: "#94a3b8",

        fontSize: "11px"
    },


    // =========================================================
    // DEADLINE
    // =========================================================

    deadline: {

        display: "flex",

        alignItems: "center",

        gap: "7px",

        padding: "7px 9px",

        borderRadius: "8px",

        fontSize: "11px",

        minWidth: "120px"
    },


    deadlineSmall: {

        display: "block",

        marginTop: "2px",

        fontSize: "10px"
    },


    // =========================================================
    // RESUME
    // =========================================================

    resumeCell: {

        width: "150px"
    },


    uploadButton: {

        display: "inline-block",

        background:
            "linear-gradient(135deg,#eef2ff,#e0e7ff)",

        color: "#4338ca",

        border:
            "1px solid #c7d2fe",

        padding: "7px 10px",

        borderRadius: "7px",

        cursor: "pointer",

        fontSize: "11px",

        fontWeight: "700"
    },


    hiddenFile: {

        display: "none"
    },


    selectedFile: {

        marginTop: "6px",

        color: "#047857",

        backgroundColor:
            "#ecfdf5",

        padding: "5px 7px",

        borderRadius: "5px",

        fontSize: "10px",

        overflow: "hidden",

        textOverflow: "ellipsis",

        whiteSpace: "nowrap",

        maxWidth: "145px"
    },


    // =========================================================
    // APPLY BUTTON
    // =========================================================

    applyButton: {

        border: "none",

        background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",

        color: "white",

        padding: "9px 15px",

        borderRadius: "8px",

        cursor: "pointer",

        fontWeight: "800",

        fontSize: "11px",

        whiteSpace: "nowrap",

        boxShadow:
            "0 4px 12px rgba(37,99,235,0.20)"
    },


    disabledButton: {

        border: "none",

        backgroundColor:
            "#e2e8f0",

        color: "#94a3b8",

        padding: "9px 15px",

        borderRadius: "8px",

        cursor: "not-allowed",

        fontWeight: "800",

        fontSize: "11px",

        whiteSpace: "nowrap"
    },


    // =========================================================
    // LOADING
    // =========================================================

    loadingBox: {

        backgroundColor: "white",

        borderRadius: "15px",

        padding: "70px 30px",

        textAlign: "center",

        border:
            "1px solid #e5e7eb"
    },


    spinner: {

        fontSize: "40px",

        color: "#2563eb",

        marginBottom: "10px"
    },


    // =========================================================
    // EMPTY
    // =========================================================

    emptyBox: {

        backgroundColor: "white",

        borderRadius: "15px",

        padding: "70px 30px",

        textAlign: "center",

        border:
            "1px solid #e5e7eb"
    },


    emptyIcon: {

        fontSize: "50px",

        marginBottom: "10px"
    },


    primaryButton: {

        marginTop: "15px",

        background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",

        color: "white",

        border: "none",

        padding: "11px 20px",

        borderRadius: "8px",

        cursor: "pointer",

        fontWeight: "800"
    }

};


export default Jobs;