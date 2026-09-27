import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RecruiterJobs() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [formData, setFormData] = useState({
        jobTitle: "",
        company: "",
        location: "",
        description: "",
        skills: "",
        salary: "",
        applicationDeadline: ""
    });


    // =====================================================
    // LOAD JOBS
    // =====================================================

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

            setJobs(response.data || []);

        } catch (err) {

            console.error("Jobs error:", err);

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
                    "Unable to load jobs."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setFormData({
            jobTitle: "",
            company: "",
            location: "",
            description: "",
            skills: "",
            salary: "",
            applicationDeadline: ""
        });

        setEditingJob(null);
    };


    // =====================================================
    // OPEN ADD FORM
    // =====================================================

    const openAddForm = () => {

        resetForm();

        setShowForm(true);
    };


    // =====================================================
    // OPEN EDIT FORM
    // =====================================================

    const openEditForm = (job) => {

        setEditingJob(job);

        setFormData({
            jobTitle: job.jobTitle || "",
            company: job.company || "",
            location: job.location || "",
            description: job.description || "",
            skills: job.skills || "",
            salary: job.salary || "",
            applicationDeadline:
                job.applicationDeadline || ""
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {

        setShowForm(false);

        resetForm();
    };


    // =====================================================
    // CREATE / UPDATE JOB
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            setSaving(true);

            const requestData = {

                jobTitle:
                    formData.jobTitle.trim(),

                company:
                    formData.company.trim(),

                location:
                    formData.location.trim(),

                description:
                    formData.description.trim(),

                skills:
                    formData.skills.trim(),

                salary:
                    formData.salary
                        ? Number(formData.salary)
                        : null,

                applicationDeadline:
                    formData.applicationDeadline || null
            };


            if (editingJob) {

                await axios.put(

                    `http://localhost:8085/api/jobs/${editingJob.id}`,

                    requestData,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                alert(
                    "Job updated successfully."
                );

            } else {

                await axios.post(

                    "http://localhost:8085/api/jobs/create",

                    requestData,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                alert(
                    "Job created successfully."
                );
            }


            closeForm();

            await loadJobs();

        } catch (err) {

            console.error(
                "Save job error:",
                err
            );

            alert(
                err.response?.data ||
                "Unable to save job."
            );

        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // DELETE JOB
    // =====================================================

    const deleteJob = async (jobId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this job?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            setDeletingId(jobId);

            await axios.delete(

                `http://localhost:8085/api/jobs/${jobId}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Job deleted successfully."
            );

            await loadJobs();

        } catch (err) {

            console.error(
                "Delete job error:",
                err
            );

            alert(
                err.response?.data ||
                "Unable to delete job."
            );

        } finally {

            setDeletingId(null);

        }
    };


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredJobs = useMemo(() => {

        const searchValue =
            search.toLowerCase().trim();

        return jobs.filter(job => {

            const title =
                job.jobTitle
                    ?.toLowerCase() || "";

            const company =
                job.company
                    ?.toLowerCase() || "";

            const location =
                job.location
                    ?.toLowerCase() || "";

            const skills =
                job.skills
                    ?.toLowerCase() || "";

            const status =
                job.status || "OPEN";


            const matchesSearch =
                !searchValue ||
                title.includes(searchValue) ||
                company.includes(searchValue) ||
                location.includes(searchValue) ||
                skills.includes(searchValue);


            const matchesStatus =
                statusFilter === "ALL" ||
                status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        jobs,
        search,
        statusFilter
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalJobs =
        jobs.length;

    const openJobs =
        jobs.filter(
            job =>
                (job.status || "OPEN") ===
                "OPEN"
        ).length;

    const closedJobs =
        jobs.filter(
            job =>
                job.status ===
                "CLOSED"
        ).length;


    // =====================================================
    // DEADLINE STATUS
    // =====================================================

    const getDeadlineStatus = (
        deadline
    ) => {

        if (!deadline) {

            return {
                text: "No deadline",
                type: "normal"
            };
        }

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        const deadlineDate =
            new Date(deadline);

        deadlineDate.setHours(
            0,
            0,
            0,
            0
        );


        if (deadlineDate < today) {

            return {
                text: "Expired",
                type: "expired"
            };
        }


        const difference =
            Math.ceil(
                (
                    deadlineDate -
                    today
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        if (difference <= 3) {

            return {
                text:
                    `${difference} day${difference === 1 ? "" : "s"} left`,
                type: "urgent"
            };
        }


        return {
            text: "Active",
            type: "normal"
        };
    };


    // =====================================================
    // FORMAT SALARY
    // =====================================================

    const formatSalary = (
        salary
    ) => {

        if (
            salary === null ||
            salary === undefined ||
            salary === ""
        ) {
            return "Not specified";
        }

        return `₹${Number(
            salary
        ).toLocaleString("en-IN")}`;
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
    // UI
    // =====================================================

    return (

        <div style={styles.container}>


            {/* =================================================
                HEADER
            ================================================= */}

            <header style={styles.header}>

                <div style={styles.brandArea}>

                    <div style={styles.logo}>
                        RP
                    </div>

                    <div>

                        <div style={styles.brandName}>
                            Recruitment Portal
                        </div>

                        <div style={styles.brandSubtitle}>
                            Recruiter Workspace
                        </div>

                    </div>

                </div>


                <div style={styles.headerRight}>

                    <div style={styles.recruiterBadge}>

                        <div style={styles.avatar}>
                            R
                        </div>

                        <span>
                            Recruiter
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


            <div style={styles.layout}>


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside style={styles.sidebar}>

                    <div style={styles.menuTitle}>
                        MAIN MENU
                    </div>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-dashboard"
                            )
                        }
                    >
                        <span>
                            🏠
                        </span>

                        Dashboard
                    </button>


                    <button
                        style={{
                            ...styles.menuButton,
                            ...styles.activeMenu
                        }}
                        onClick={() =>
                            navigate(
                                "/recruiter-jobs"
                            )
                        }
                    >
                        <span>
                            💼
                        </span>

                        Jobs
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-applicants"
                            )
                        }
                    >
                        <span>
                            👥
                        </span>

                        Applicants
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-interviews"
                            )
                        }
                    >
                        <span>
                            📅
                        </span>

                        Interviews
                    </button>


                    <div style={styles.divider} />


                    <div style={styles.menuTitle}>
                        ACCOUNT
                    </div>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-profile"
                            )
                        }
                    >
                        <span>
                            👤
                        </span>

                        Profile
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
                                Recruiter / Jobs
                            </div>

                            <h1 style={styles.pageTitle}>
                                Job Management
                            </h1>

                            <p style={styles.subtitle}>
                                Create, update and manage
                                your job postings.
                            </p>

                        </div>


                        <button
                            style={styles.addButton}
                            onClick={openAddForm}
                        >
                            <span>
                                +
                            </span>

                            Add New Job
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
                                    background:
                                        "linear-gradient(135deg,#dbeafe,#e0e7ff)"
                                }}
                            >
                                💼
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    Total Jobs
                                </div>

                                <div style={styles.statValue}>
                                    {totalJobs}
                                </div>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div
                                style={{
                                    ...styles.statIcon,
                                    background:
                                        "linear-gradient(135deg,#dcfce7,#bbf7d0)"
                                }}
                            >
                                🟢
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    Open Jobs
                                </div>

                                <div
                                    style={{
                                        ...styles.statValue,
                                        color: "#15803d"
                                    }}
                                >
                                    {openJobs}
                                </div>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div
                                style={{
                                    ...styles.statIcon,
                                    background:
                                        "linear-gradient(135deg,#fee2e2,#fecaca)"
                                }}
                            >
                                🔴
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    Closed Jobs
                                </div>

                                <div
                                    style={{
                                        ...styles.statValue,
                                        color: "#dc2626"
                                    }}
                                >
                                    {closedJobs}
                                </div>

                            </div>

                        </div>


                        <div style={styles.statCard}>

                            <div
                                style={{
                                    ...styles.statIcon,
                                    background:
                                        "linear-gradient(135deg,#fef3c7,#fde68a)"
                                }}
                            >
                                📊
                            </div>

                            <div>

                                <div style={styles.statLabel}>
                                    Showing
                                </div>

                                <div style={styles.statValue}>
                                    {filteredJobs.length}
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================= */}

                    {showForm && (

                        <div style={styles.formCard}>

                            <div style={styles.formHeader}>

                                <div>

                                    <h2 style={styles.formTitle}>
                                        {editingJob
                                            ? "✏️ Edit Job"
                                            : "➕ Create New Job"}
                                    </h2>

                                    <p style={styles.formSubtitle}>
                                        Enter the job details below.
                                    </p>

                                </div>


                                <button
                                    style={styles.closeButton}
                                    onClick={closeForm}
                                >
                                    ✕
                                </button>

                            </div>


                            <form
                                onSubmit={handleSubmit}
                            >

                                <div style={styles.formGrid}>


                                    <div style={styles.formGroup}>

                                        <label>
                                            Job Title
                                        </label>

                                        <input
                                            type="text"
                                            name="jobTitle"
                                            value={
                                                formData.jobTitle
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Java Developer"
                                            required
                                            style={styles.input}
                                        />

                                    </div>


                                    <div style={styles.formGroup}>

                                        <label>
                                            Company
                                        </label>

                                        <input
                                            type="text"
                                            name="company"
                                            value={
                                                formData.company
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Company name"
                                            required
                                            style={styles.input}
                                        />

                                    </div>


                                    <div style={styles.formGroup}>

                                        <label>
                                            Location
                                        </label>

                                        <input
                                            type="text"
                                            name="location"
                                            value={
                                                formData.location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Hyderabad"
                                            required
                                            style={styles.input}
                                        />

                                    </div>


                                    <div style={styles.formGroup}>

                                        <label>
                                            Salary
                                        </label>

                                        <input
                                            type="number"
                                            name="salary"
                                            value={
                                                formData.salary
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. 600000"
                                            style={styles.input}
                                        />

                                    </div>


                                    <div style={styles.formGroup}>

                                        <label>
                                            Application Deadline
                                        </label>

                                        <input
                                            type="date"
                                            name="applicationDeadline"
                                            value={
                                                formData.applicationDeadline
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            style={styles.input}
                                        />

                                    </div>


                                    <div style={styles.formGroup}>

                                        <label>
                                            Skills
                                        </label>

                                        <input
                                            type="text"
                                            name="skills"
                                            value={
                                                formData.skills
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Java, Spring Boot, SQL"
                                            required
                                            style={styles.input}
                                        />

                                    </div>

                                </div>


                                <div
                                    style={{
                                        ...styles.formGroup,
                                        marginTop: "20px"
                                    }}
                                >

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="5"
                                        placeholder="Enter complete job description..."
                                        required
                                        style={styles.textarea}
                                    />

                                </div>


                                <div style={styles.formActions}>

                                    <button
                                        type="button"
                                        style={styles.cancelButton}
                                        onClick={closeForm}
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        style={styles.saveButton}
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingJob
                                                ? "Update Job"
                                                : "Create Job"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    )}


                    {/* =================================================
                        SEARCH / FILTER
                    ================================================= */}

                    <div style={styles.filterPanel}>

                        <div style={styles.searchBox}>

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search jobs, companies, locations or skills..."
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
                            style={styles.statusFilter}
                        >
                            <option value="ALL">
                                All Status
                            </option>

                            <option value="OPEN">
                                Open
                            </option>

                            <option value="CLOSED">
                                Closed
                            </option>
                        </select>


                        {(search ||
                            statusFilter !== "ALL") && (

                            <button
                                style={styles.clearButton}
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("ALL");
                                }}
                            >
                                Clear
                            </button>

                        )}

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div style={styles.error}>
                            ⚠️ {error}
                        </div>

                    )}


                    {/* LOADING */}

                    {loading && (

                        <div style={styles.loading}>
                            <div style={styles.spinner}>
                                ⟳
                            </div>

                            <h3>
                                Loading jobs...
                            </h3>

                            <p>
                                Fetching your job postings.
                            </p>
                        </div>

                    )}


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    {!loading &&
                        !error &&
                        filteredJobs.length > 0 && (

                            <div style={styles.tableCard}>

                                <div style={styles.tableHeader}>

                                    <div>

                                        <h2 style={styles.tableTitle}>
                                            Job Postings
                                        </h2>

                                        <p style={styles.tableSubtitle}>
                                            {filteredJobs.length} job
                                            {filteredJobs.length !== 1
                                                ? "s"
                                                : ""}{" "}
                                            displayed
                                        </p>

                                    </div>

                                </div>


                                <div style={styles.tableWrapper}>

                                    <table style={styles.table}>

                                        <thead>

                                            <tr>

                                                <th style={styles.th}>
                                                    Job
                                                </th>

                                                <th style={styles.th}>
                                                    Location
                                                </th>

                                                <th style={styles.th}>
                                                    Salary
                                                </th>

                                                <th style={styles.th}>
                                                    Skills
                                                </th>

                                                <th style={styles.th}>
                                                    Deadline
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

                                            {filteredJobs.map(
                                                (job) => {

                                                    const deadline =
                                                        getDeadlineStatus(
                                                            job.applicationDeadline
                                                        );

                                                    const status =
                                                        job.status ||
                                                        "OPEN";

                                                    return (

                                                        <tr
                                                            key={job.id}
                                                            style={styles.tr}
                                                        >

                                                            {/* JOB */}

                                                            <td style={styles.td}>

                                                                <div style={styles.jobInfo}>

                                                                    <div style={styles.jobIcon}>
                                                                        {(job.jobTitle ||
                                                                            "J")
                                                                            .charAt(0)
                                                                            .toUpperCase()}
                                                                    </div>


                                                                    <div>

                                                                        <div style={styles.jobTitle}>
                                                                            {job.jobTitle ||
                                                                                "Untitled Job"}
                                                                        </div>

                                                                        <div style={styles.company}>
                                                                            {job.company ||
                                                                                "Company"}
                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            {/* LOCATION */}

                                                            <td style={styles.td}>

                                                                <div style={styles.location}>
                                                                    📍{" "}
                                                                    {job.location ||
                                                                        "Not specified"}
                                                                </div>

                                                            </td>


                                                            {/* SALARY */}

                                                            <td style={styles.td}>

                                                                <strong style={styles.salary}>
                                                                    {formatSalary(
                                                                        job.salary
                                                                    )}
                                                                </strong>

                                                            </td>


                                                            {/* SKILLS */}

                                                            <td style={styles.td}>

                                                                <div style={styles.skills}>

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
                                                                                            styles.skill
                                                                                        }
                                                                                    >
                                                                                        {skill.trim()}
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

                                                            <td style={styles.td}>

                                                                <div style={styles.deadline}>

                                                                    <div>
                                                                        {job.applicationDeadline ||
                                                                            "Not specified"}
                                                                    </div>

                                                                    <span
                                                                        style={
                                                                            deadline.type ===
                                                                                "expired"
                                                                                ? styles.expired
                                                                                : deadline.type ===
                                                                                    "urgent"
                                                                                    ? styles.urgent
                                                                                    : styles.activeDeadline
                                                                        }
                                                                    >
                                                                        {deadline.text}
                                                                    </span>

                                                                </div>

                                                            </td>


                                                            {/* STATUS */}

                                                            <td style={styles.td}>

                                                                <span
                                                                    style={
                                                                        status ===
                                                                            "OPEN"
                                                                            ? styles.openStatus
                                                                            : styles.closedStatus
                                                                    }
                                                                >

                                                                    <span style={styles.statusDot}>
                                                                        ●
                                                                    </span>

                                                                    {status}

                                                                </span>

                                                            </td>


                                                            {/* ACTIONS */}

                                                            <td style={styles.td}>

                                                                <div style={styles.actions}>

                                                                    <button
                                                                        style={styles.applicantButton}
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/recruiter-applicants/${job.id}`
                                                                            )
                                                                        }
                                                                        title="View Applicants"
                                                                    >
                                                                        👥
                                                                    </button>


                                                                    <button
                                                                        style={styles.editButton}
                                                                        onClick={() =>
                                                                            openEditForm(
                                                                                job
                                                                            )
                                                                        }
                                                                        title="Edit Job"
                                                                    >
                                                                        ✏️
                                                                    </button>


                                                                    <button
                                                                        style={styles.deleteButton}
                                                                        onClick={() =>
                                                                            deleteJob(
                                                                                job.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            deletingId ===
                                                                            job.id
                                                                        }
                                                                        title="Delete Job"
                                                                    >
                                                                        {deletingId ===
                                                                            job.id
                                                                            ? "..."
                                                                            : "🗑️"}
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


                    {/* =================================================
                        NO JOBS
                    ================================================= */}

                    {!loading &&
                        !error &&
                        filteredJobs.length === 0 && (

                            <div style={styles.empty}>

                                <div style={styles.emptyIcon}>
                                    🔍
                                </div>

                                <h2>
                                    No Jobs Found
                                </h2>

                                <p>
                                    {jobs.length === 0
                                        ? "You haven't created any job postings yet."
                                        : "No jobs match your current search or filter."}
                                </p>


                                {jobs.length === 0 ? (

                                    <button
                                        style={styles.addButton}
                                        onClick={openAddForm}
                                    >
                                        + Create Your First Job
                                    </button>

                                ) : (

                                    <button
                                        style={styles.clearButtonLarge}
                                        onClick={() => {
                                            setSearch("");
                                            setStatusFilter("ALL");
                                        }}
                                    >
                                        Clear Filters
                                    </button>

                                )}

                            </div>

                        )}

                </main>

            </div>

        </div>
    );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

    container: {
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
        fontFamily:
            "'Inter', 'Segoe UI', Arial, sans-serif",
        color: "#172033"
    },


    // =================================================
    // HEADER
    // =================================================

    header: {
        height: "72px",
        background:
            "linear-gradient(135deg,#0f172a,#1e3a8a,#4338ca)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        boxSizing: "border-box",
        boxShadow:
            "0 5px 20px rgba(15,23,42,0.18)"
    },


    brandArea: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    logo: {
        width: "43px",
        height: "43px",
        borderRadius: "12px",
        background:
            "linear-gradient(135deg,#3b82f6,#8b5cf6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800"
    },


    brandName: {
        fontSize: "18px",
        fontWeight: "700"
    },


    brandSubtitle: {
        fontSize: "11px",
        color: "#bfdbfe",
        marginTop: "2px"
    },


    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "18px"
    },


    recruiterBadge: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px"
    },


    avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background:
            "linear-gradient(135deg,#dbeafe,#e0e7ff)",
        color: "#1d4ed8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700"
    },


    logoutButton: {
        border:
            "1px solid rgba(255,255,255,0.25)",
        backgroundColor:
            "rgba(255,255,255,0.08)",
        color: "white",
        padding: "9px 17px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // =================================================
    // LAYOUT
    // =================================================

    layout: {
        display: "flex",
        minHeight:
            "calc(100vh - 72px)"
    },


    sidebar: {
        width: "235px",
        backgroundColor: "white",
        padding: "28px 15px",
        boxSizing: "border-box",
        borderRight:
            "1px solid #e5e7eb",
        flexShrink: 0
    },


    menuTitle: {
        fontSize: "11px",
        fontWeight: "700",
        color: "#94a3b8",
        letterSpacing: "1px",
        padding: "0 12px",
        marginBottom: "12px"
    },


    menuButton: {
        width: "100%",
        border: "none",
        backgroundColor: "transparent",
        color: "#64748b",
        padding: "13px 14px",
        marginBottom: "5px",
        borderRadius: "9px",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    activeMenu: {
        background:
            "linear-gradient(135deg,#eff6ff,#eef2ff)",
        color: "#2563eb",
        fontWeight: "700",
        boxShadow:
            "0 3px 10px rgba(37,99,235,0.08)"
    },


    divider: {
        height: "1px",
        backgroundColor: "#e5e7eb",
        margin: "22px 8px"
    },


    // =================================================
    // MAIN
    // =================================================

    main: {
        flex: 1,
        padding: "35px",
        boxSizing: "border-box",
        minWidth: 0
    },


    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "28px"
    },


    breadcrumb: {
        fontSize: "13px",
        color: "#64748b",
        marginBottom: "8px"
    },


    pageTitle: {
        margin: 0,
        fontSize: "30px",
        fontWeight: "750",
        color: "#111827"
    },


    subtitle: {
        margin:
            "8px 0 0",
        color: "#64748b",
        fontSize: "15px"
    },


    addButton: {
        border: "none",
        background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",
        color: "white",
        padding: "12px 20px",
        borderRadius: "9px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "700",
        boxShadow:
            "0 5px 14px rgba(37,99,235,0.25)"
    },


    // =================================================
    // STATS
    // =================================================

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4,minmax(180px,1fr))",
        gap: "16px",
        marginBottom: "25px"
    },


    statCard: {
        backgroundColor: "white",
        border:
            "1px solid #e5e7eb",
        borderRadius: "13px",
        padding: "18px",
        display: "flex",
        alignItems: "center",
        gap: "13px",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.04)"
    },


    statIcon: {
        width: "45px",
        height: "45px",
        borderRadius: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
    },


    statLabel: {
        color: "#64748b",
        fontSize: "12px",
        fontWeight: "600"
    },


    statValue: {
        marginTop: "3px",
        fontSize: "23px",
        fontWeight: "800",
        color: "#111827"
    },


    // =================================================
    // FORM
    // =================================================

    formCard: {
        backgroundColor: "white",
        borderRadius: "14px",
        padding: "28px",
        marginBottom: "25px",
        border:
            "1px solid #e5e7eb",
        boxShadow:
            "0 8px 25px rgba(15,23,42,0.07)"
    },


    formHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "25px"
    },


    formTitle: {
        margin: 0,
        color: "#111827"
    },


    formSubtitle: {
        margin:
            "5px 0 0",
        color: "#64748b",
        fontSize: "13px"
    },


    closeButton: {
        border: "none",
        backgroundColor: "#f1f5f9",
        color: "#64748b",
        width: "35px",
        height: "35px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px"
    },


    formGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2,minmax(0,1fr))",
        gap: "18px"
    },


    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "7px"
    },


    input: {
        width: "100%",
        padding: "11px 12px",
        border:
            "1px solid #cbd5e1",
        borderRadius: "8px",
        boxSizing: "border-box",
        outline: "none",
        fontSize: "14px"
    },


    textarea: {
        width: "100%",
        padding: "11px 12px",
        border:
            "1px solid #cbd5e1",
        borderRadius: "8px",
        boxSizing: "border-box",
        outline: "none",
        resize: "vertical",
        fontSize: "14px"
    },


    formActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "25px"
    },


    saveButton: {
        border: "none",
        background:
            "linear-gradient(135deg,#16a34a,#059669)",
        color: "white",
        padding: "11px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "700"
    },


    cancelButton: {
        border: "none",
        backgroundColor: "#64748b",
        color: "white",
        padding: "11px 20px",
        borderRadius: "8px",
        cursor: "pointer"
    },


    // =================================================
    // FILTER
    // =================================================

    filterPanel: {
        backgroundColor: "white",
        padding: "13px",
        borderRadius: "12px",
        border:
            "1px solid #e5e7eb",
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        boxShadow:
            "0 4px 15px rgba(15,23,42,0.04)"
    },


    searchBox: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: "9px",
        border:
            "1px solid #dbe2ea",
        borderRadius: "8px",
        padding: "0 12px",
        minHeight: "44px"
    },


    searchInput: {
        width: "100%",
        border: "none",
        outline: "none",
        fontSize: "14px"
    },


    statusFilter: {
        width: "150px",
        border:
            "1px solid #dbe2ea",
        borderRadius: "8px",
        padding: "0 12px",
        outline: "none",
        backgroundColor: "white",
        color: "#475569"
    },


    clearButton: {
        border: "none",
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        padding: "0 15px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // =================================================
    // TABLE
    // =================================================

    tableCard: {
        backgroundColor: "white",
        border:
            "1px solid #e5e7eb",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow:
            "0 6px 22px rgba(15,23,42,0.06)"
    },


    tableHeader: {
        padding: "20px 22px",
        borderBottom:
            "1px solid #e5e7eb"
    },


    tableTitle: {
        margin: 0,
        fontSize: "18px",
        color: "#111827"
    },


    tableSubtitle: {
        margin:
            "4px 0 0",
        fontSize: "12px",
        color: "#64748b"
    },


    tableWrapper: {
        width: "100%",
        overflowX: "auto"
    },


    table: {
        width: "100%",
        minWidth: "1050px",
        borderCollapse: "collapse"
    },


    th: {
        textAlign: "left",
        padding: "14px 18px",
        backgroundColor: "#f8fafc",
        color: "#64748b",
        fontSize: "11px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        borderBottom:
            "1px solid #e5e7eb"
    },


    tr: {
        borderBottom:
            "1px solid #eef2f7"
    },


    td: {
        padding: "17px 18px",
        verticalAlign: "middle",
        fontSize: "13px"
    },


    jobInfo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minWidth: "220px"
    },


    jobIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        background:
            "linear-gradient(135deg,#dbeafe,#e0e7ff)",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        fontSize: "16px",
        flexShrink: 0
    },


    jobTitle: {
        fontWeight: "700",
        color: "#111827",
        marginBottom: "4px"
    },


    company: {
        color: "#64748b",
        fontSize: "12px"
    },


    location: {
        color: "#475569",
        whiteSpace: "nowrap"
    },


    salary: {
        color: "#15803d",
        whiteSpace: "nowrap"
    },


    skills: {
        display: "flex",
        flexWrap: "wrap",
        gap: "5px",
        maxWidth: "210px"
    },


    skill: {
        backgroundColor: "#f1f5f9",
        color: "#475569",
        padding: "4px 7px",
        borderRadius: "5px",
        fontSize: "10px",
        fontWeight: "600"
    },


    noData: {
        color: "#94a3b8"
    },


    deadline: {
        color: "#475569",
        whiteSpace: "nowrap"
    },


    activeDeadline: {
        display: "inline-block",
        marginTop: "4px",
        backgroundColor: "#ecfdf5",
        color: "#047857",
        padding: "3px 7px",
        borderRadius: "5px",
        fontSize: "10px",
        fontWeight: "700"
    },


    urgent: {
        display: "inline-block",
        marginTop: "4px",
        backgroundColor: "#fff7ed",
        color: "#c2410c",
        padding: "3px 7px",
        borderRadius: "5px",
        fontSize: "10px",
        fontWeight: "700"
    },


    expired: {
        display: "inline-block",
        marginTop: "4px",
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "3px 7px",
        borderRadius: "5px",
        fontSize: "10px",
        fontWeight: "700"
    },


    openStatus: {
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        backgroundColor: "#ecfdf5",
        color: "#15803d",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700"
    },


    closedStatus: {
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700"
    },


    statusDot: {
        fontSize: "8px"
    },


    actions: {
        display: "flex",
        gap: "6px"
    },


    applicantButton: {
        width: "34px",
        height: "34px",
        border: "none",
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        borderRadius: "7px",
        cursor: "pointer"
    },


    editButton: {
        width: "34px",
        height: "34px",
        border: "none",
        backgroundColor: "#fff7ed",
        color: "#ea580c",
        borderRadius: "7px",
        cursor: "pointer"
    },


    deleteButton: {
        width: "34px",
        height: "34px",
        border: "none",
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        borderRadius: "7px",
        cursor: "pointer"
    },


    // =================================================
    // LOADING / EMPTY
    // =================================================

    loading: {
        backgroundColor: "white",
        padding: "70px",
        textAlign: "center",
        borderRadius: "14px",
        border:
            "1px solid #e5e7eb"
    },


    spinner: {
        fontSize: "40px",
        color: "#2563eb"
    },


    empty: {
        backgroundColor: "white",
        padding: "70px 30px",
        textAlign: "center",
        borderRadius: "14px",
        border:
            "1px solid #e5e7eb"
    },


    emptyIcon: {
        fontSize: "50px",
        marginBottom: "10px"
    },


    clearButtonLarge: {
        marginTop: "15px",
        border: "none",
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        padding: "11px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "700"
    },


    error: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "14px",
        borderRadius: "8px",
        marginBottom: "20px"
    }

};


export default RecruiterJobs;