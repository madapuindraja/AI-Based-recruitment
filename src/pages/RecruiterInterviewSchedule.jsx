import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function RecruiterScheduleInterview() {

    const navigate = useNavigate();
    const { applicationId } = useParams();

    const [formData, setFormData] = useState({
        interviewDate: "",
        interviewTime: "",
        interviewerName: "",
        meetingLink: ""
    });

    const [loading, setLoading] = useState(false);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // =====================================================
    // SCHEDULE INTERVIEW
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        // Validation

        if (!formData.interviewDate) {
            alert("Please select interview date.");
            return;
        }

        if (!formData.interviewTime) {
            alert("Please select interview time.");
            return;
        }

        if (!formData.interviewerName.trim()) {
            alert("Please enter interviewer name.");
            return;
        }

        if (!formData.meetingLink.trim()) {
            alert("Please enter meeting link.");
            return;
        }

        try {

            setLoading(true);

            const requestData = {

                applicationId: Number(applicationId),

                interviewDate:
                    formData.interviewDate,

                interviewTime:
                    formData.interviewTime,

                interviewerName:
                    formData.interviewerName.trim(),

                meetingLink:
                    formData.meetingLink.trim()
            };

            console.log(
                "Scheduling Interview:",
                requestData
            );

            const response = await axios.post(

                "http://localhost:8085/api/interviews/schedule",

                requestData,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );

            console.log(
                "Interview scheduled:",
                response.data
            );

            alert(
                "Interview scheduled successfully!"
            );

            navigate(
                "/recruiter-interviews"
            );

        } catch (error) {

            console.error(
                "Schedule interview error:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("role");

                navigate("/login");

                return;
            }

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to schedule interview."
            );

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
    // TODAY DATE
    // =====================================================

    const today = new Date()
        .toISOString()
        .split("T")[0];


    // =====================================================
    // UI
    // =====================================================

    return (

        <div style={styles.container}>

            {/* =================================================
                HEADER
            ================================================= */}

            <header style={styles.header}>

                <div style={styles.brand}>

                    <div style={styles.logo}>
                        RP
                    </div>

                    <div>

                        <div style={styles.brandTitle}>
                            Recruitment Portal
                        </div>

                        <div style={styles.brandSubtitle}>
                            Recruiter Workspace
                        </div>

                    </div>

                </div>


                <div style={styles.headerRight}>

                    <div style={styles.profileCircle}>
                        R
                    </div>

                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        🚪 Logout
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

                    <div style={styles.sidebarLabel}>
                        RECRUITER
                    </div>


                    {/* DASHBOARD */}

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-dashboard"
                            )
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
                            navigate(
                                "/recruiter-jobs"
                            )
                        }
                    >

                        <span style={styles.menuIcon}>
                            💼
                        </span>

                        <span>
                            Jobs
                        </span>

                    </button>


                    {/* APPLICANTS */}

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-applicants"
                            )
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
                        style={styles.activeMenuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-interviews"
                            )
                        }
                    >

                        <span style={styles.menuIcon}>
                            📅
                        </span>

                        <span>
                            Interviews
                        </span>

                        <span style={styles.activeDot}>
                            ●
                        </span>

                    </button>


                    {/* PROFILE */}

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-profile"
                            )
                        }
                    >

                        <span style={styles.menuIcon}>
                            👤
                        </span>

                        <span>
                            Profile
                        </span>

                    </button>


                    {/* HELP */}

                    <div style={styles.sidebarBottom}>

                        <div style={styles.helpCard}>

                            <div style={styles.helpIcon}>
                                💡
                            </div>

                            <strong>
                                Need help?
                            </strong>

                            <span>
                                Manage your hiring process
                                easily.
                            </span>

                        </div>

                    </div>

                </aside>


                {/* =================================================
                    MAIN
                ================================================= */}

                <main style={styles.main}>


                    {/* PAGE HEADER */}

                    <div style={styles.pageHeader}>

                        <div>

                            <div style={styles.breadcrumb}>
                                Recruiter / Interviews / Schedule
                            </div>

                            <h1 style={styles.pageTitle}>
                                📅 Schedule Interview
                            </h1>

                            <p style={styles.pageSubtitle}>
                                Schedule an interview for
                                application #{applicationId}
                            </p>

                        </div>


                        <button
                            style={styles.backButton}
                            onClick={() =>
                                navigate(-1)
                            }
                        >
                            ← Back
                        </button>

                    </div>


                    {/* =================================================
                        APPLICATION INFO
                    ================================================= */}

                    <div style={styles.applicationCard}>

                        <div style={styles.applicationIcon}>
                            📋
                        </div>

                        <div>

                            <span style={styles.applicationLabel}>
                                APPLICATION
                            </span>

                            <strong style={styles.applicationNumber}>
                                Application #{applicationId}
                            </strong>

                            <span style={styles.applicationText}>
                                Schedule an interview for this candidate
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        style={styles.form}
                        onSubmit={handleSubmit}
                    >

                        <div style={styles.formHeader}>

                            <div style={styles.formHeaderIcon}>
                                📅
                            </div>

                            <div>

                                <h2 style={styles.formTitle}>
                                    Interview Details
                                </h2>

                                <p style={styles.formSubtitle}>
                                    Enter the interview schedule
                                    and meeting information.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            DATE + TIME
                        ================================================= */}

                        <div style={styles.formGrid}>


                            {/* DATE */}

                            <div style={styles.formGroup}>

                                <label style={styles.label}>
                                    📅 Interview Date
                                </label>

                                <input
                                    type="date"
                                    name="interviewDate"
                                    value={
                                        formData.interviewDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min={today}
                                    style={styles.input}
                                    required
                                />

                                <span style={styles.inputHint}>
                                    Select the interview date
                                </span>

                            </div>


                            {/* TIME */}

                            <div style={styles.formGroup}>

                                <label style={styles.label}>
                                    🕐 Interview Time
                                </label>

                                <input
                                    type="time"
                                    name="interviewTime"
                                    value={
                                        formData.interviewTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={styles.input}
                                    required
                                />

                                <span style={styles.inputHint}>
                                    Select the interview time
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            INTERVIEWER
                        ================================================= */}

                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                👤 Interviewer Name
                            </label>

                            <input
                                type="text"
                                name="interviewerName"
                                placeholder="Enter interviewer name"
                                value={
                                    formData.interviewerName
                                }
                                onChange={
                                    handleChange
                                }
                                style={styles.input}
                                required
                            />

                            <span style={styles.inputHint}>
                                Name of the person conducting
                                the interview
                            </span>

                        </div>


                        {/* =================================================
                            MEETING LINK
                        ================================================= */}

                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                🔗 Meeting Link
                            </label>

                            <input
                                type="url"
                                name="meetingLink"
                                placeholder="https://meet.google.com/..."
                                value={
                                    formData.meetingLink
                                }
                                onChange={
                                    handleChange
                                }
                                style={styles.input}
                                required
                            />

                            <span style={styles.inputHint}>
                                Google Meet, Microsoft Teams,
                                Zoom or other meeting link
                            </span>

                        </div>


                        {/* =================================================
                            INTERVIEW PREVIEW
                        ================================================= */}

                        {(formData.interviewDate ||
                            formData.interviewTime ||
                            formData.interviewerName) && (

                            <div style={styles.previewCard}>

                                <div style={styles.previewHeader}>
                                    👁️ Interview Preview
                                </div>

                                <div style={styles.previewGrid}>

                                    <div>

                                        <span>
                                            DATE
                                        </span>

                                        <strong>
                                            {formData.interviewDate ||
                                                "Not selected"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            TIME
                                        </span>

                                        <strong>
                                            {formData.interviewTime ||
                                                "Not selected"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            INTERVIEWER
                                        </span>

                                        <strong>
                                            {formData.interviewerName ||
                                                "Not entered"}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            ACTION BUTTONS
                        ================================================= */}

                        <div style={styles.actionsSection}>

                            <div style={styles.actionLabel}>
                                INTERVIEW ACTIONS
                            </div>

                            <div style={styles.actions}>


                                {/* CANCEL */}

                                <button
                                    type="button"
                                    style={styles.cancelButton}
                                    onClick={() =>
                                        navigate(-1)
                                    }
                                    disabled={loading}
                                >
                                    <span>
                                        ✕
                                    </span>

                                    <span>
                                        Cancel
                                    </span>

                                </button>


                                {/* BACK TO INTERVIEWS */}

                                <button
                                    type="button"
                                    style={styles.interviewsButton}
                                    onClick={() =>
                                        navigate(
                                            "/recruiter-interviews"
                                        )
                                    }
                                    disabled={loading}
                                >
                                    <span>
                                        📅
                                    </span>

                                    <span>
                                        View Interviews
                                    </span>

                                </button>


                                {/* SCHEDULE */}

                                <button
                                    type="submit"
                                    style={{
                                        ...styles.scheduleButton,
                                        opacity:
                                            loading
                                                ? 0.7
                                                : 1
                                    }}
                                    disabled={loading}
                                >

                                    <span style={styles.buttonIcon}>
                                        {loading
                                            ? "⏳"
                                            : "📅"}
                                    </span>

                                    <span>
                                        {loading
                                            ? "Scheduling..."
                                            : "Schedule Interview"}
                                    </span>

                                </button>

                            </div>

                        </div>

                    </form>

                </main>

            </div>

        </div>
    );
}


// =====================================================
// PROFESSIONAL STYLES
// =====================================================

const styles = {

    // =====================================================
    // CONTAINER
    // =====================================================

    container: {
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily:
            "'Segoe UI', Arial, sans-serif",
        color: "#172033"
    },


    // =====================================================
    // HEADER
    // =====================================================

    header: {
        height: "70px",
        background:
            "linear-gradient(135deg, #0f172a, #1e3a8a 55%, #312e81)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxSizing: "border-box",
        boxShadow:
            "0 4px 18px rgba(15,23,42,0.18)"
    },


    brand: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    logo: {
        width: "42px",
        height: "42px",
        borderRadius: "11px",
        background:
            "linear-gradient(135deg,#3b82f6,#6366f1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        fontSize: "15px",
        boxShadow:
            "0 6px 18px rgba(59,130,246,0.35)"
    },


    brandTitle: {
        fontSize: "18px",
        fontWeight: "700"
    },


    brandSubtitle: {
        fontSize: "11px",
        color: "#cbd5e1",
        marginTop: "2px"
    },


    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "14px"
    },


    profileCircle: {
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        background:
            "linear-gradient(135deg,#60a5fa,#8b5cf6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700"
    },


    logoutButton: {
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.1)",
        color: "white",
        padding: "9px 17px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // =====================================================
    // LAYOUT
    // =====================================================

    layout: {
        display: "flex",
        minHeight:
            "calc(100vh - 70px)"
    },


    // =====================================================
    // SIDEBAR
    // =====================================================

    sidebar: {
        width: "245px",
        background:
            "linear-gradient(180deg,#111827 0%,#172554 48%,#312e81 100%)",
        padding: "30px 15px",
        boxSizing: "border-box",
        boxShadow:
            "4px 0 20px rgba(15,23,42,0.12)",
        position: "relative"
    },


    sidebarLabel: {
        color: "#94a3b8",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "1.5px",
        padding: "0 13px",
        marginBottom: "18px"
    },


    menuButton: {
        width: "100%",
        border: "none",
        background: "transparent",
        color: "#cbd5e1",
        padding: "13px 14px",
        marginBottom: "6px",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    activeMenuButton: {
        width: "100%",
        border:
            "1px solid rgba(96,165,250,0.25)",
        background:
            "linear-gradient(90deg,rgba(37,99,235,0.35),rgba(99,102,241,0.22))",
        color: "white",
        padding: "13px 14px",
        marginBottom: "6px",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "14px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow:
            "0 5px 15px rgba(37,99,235,0.15)"
    },


    menuIcon: {
        width: "25px",
        textAlign: "center",
        fontSize: "17px"
    },


    activeDot: {
        marginLeft: "auto",
        color: "#60a5fa",
        fontSize: "10px"
    },


    sidebarBottom: {
        position: "absolute",
        left: "15px",
        right: "15px",
        bottom: "25px"
    },


    helpCard: {
        background:
            "rgba(255,255,255,0.08)",
        border:
            "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        padding: "15px",
        color: "#e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        fontSize: "12px"
    },


    helpIcon: {
        fontSize: "20px"
    },


    // =====================================================
    // MAIN
    // =====================================================

    main: {
        flex: 1,
        padding: "38px",
        boxSizing: "border-box",
        overflow: "auto"
    },


    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "25px"
    },


    breadcrumb: {
        color: "#64748b",
        fontSize: "12px",
        marginBottom: "8px"
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
        fontSize: "14px"
    },


    backButton: {
        background: "white",
        border: "1px solid #e2e8f0",
        color: "#334155",
        padding: "10px 17px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "600",
        boxShadow:
            "0 2px 8px rgba(15,23,42,0.04)"
    },


    // =====================================================
    // APPLICATION CARD
    // =====================================================

    applicationCard: {
        maxWidth: "850px",
        background:
            "linear-gradient(135deg,#eff6ff,#eef2ff)",
        border:
            "1px solid #dbeafe",
        borderRadius: "14px",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "22px",
        boxSizing: "border-box"
    },


    applicationIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "#2563eb",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },


    applicationLabel: {
        display: "block",
        fontSize: "10px",
        color: "#6366f1",
        fontWeight: "800",
        letterSpacing: "1px",
        marginBottom: "3px"
    },


    applicationNumber: {
        display: "block",
        color: "#172033",
        fontSize: "16px"
    },


    applicationText: {
        display: "block",
        color: "#64748b",
        fontSize: "12px",
        marginTop: "3px"
    },


    // =====================================================
    // FORM
    // =====================================================

    form: {
        background: "white",
        maxWidth: "850px",
        padding: "30px",
        borderRadius: "16px",
        border:
            "1px solid #e6eaf1",
        boxShadow:
            "0 7px 25px rgba(15,23,42,0.055)",
        boxSizing: "border-box"
    },


    formHeader: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        paddingBottom: "22px",
        marginBottom: "25px",
        borderBottom:
            "1px solid #eef2f7"
    },


    formHeaderIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "#dbeafe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },


    formTitle: {
        margin: 0,
        fontSize: "20px",
        color: "#0f172a"
    },


    formSubtitle: {
        margin: "5px 0 0",
        color: "#64748b",
        fontSize: "13px"
    },


    formGrid: {
        display: "grid",
        gridTemplateColumns:
            "1fr 1fr",
        gap: "18px"
    },


    formGroup: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px"
    },


    label: {
        fontSize: "13px",
        fontWeight: "700",
        color: "#334155",
        marginBottom: "8px"
    },


    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 13px",
        border:
            "1px solid #cbd5e1",
        borderRadius: "9px",
        fontSize: "14px",
        outline: "none",
        background: "#f8fafc",
        color: "#172033"
    },


    inputHint: {
        marginTop: "6px",
        color: "#94a3b8",
        fontSize: "11px"
    },


    // =====================================================
    // PREVIEW
    // =====================================================

    previewCard: {
        background: "#f8fafc",
        border:
            "1px solid #e2e8f0",
        borderRadius: "11px",
        padding: "17px",
        marginTop: "5px",
        marginBottom: "10px"
    },


    previewHeader: {
        fontSize: "12px",
        fontWeight: "800",
        color: "#475569",
        marginBottom: "14px"
    },


    previewGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3,1fr)",
        gap: "12px"
    },


    previewGridItem: {
        background: "white",
        padding: "10px",
        borderRadius: "8px"
    },


    // =====================================================
    // ACTIONS
    // =====================================================

    actionsSection: {
        marginTop: "25px",
        paddingTop: "22px",
        borderTop:
            "1px solid #eef2f7"
    },


    actionLabel: {
        fontSize: "10px",
        fontWeight: "800",
        color: "#94a3b8",
        letterSpacing: "1px",
        marginBottom: "11px"
    },


    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        flexWrap: "wrap"
    },


    cancelButton: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        border:
            "1px solid #cbd5e1",
        background: "white",
        color: "#475569",
        padding: "11px 17px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "13px"
    },


    interviewsButton: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        border:
            "1px solid #c7d2fe",
        background: "#eef2ff",
        color: "#4338ca",
        padding: "11px 17px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "13px"
    },


    scheduleButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        border: "none",
        background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",
        color: "white",
        padding: "11px 19px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "13px",
        boxShadow:
            "0 5px 14px rgba(175, 180, 190, 0.25)"
    },


    buttonIcon: {
        fontSize: "15px"
    }

};


export default RecruiterScheduleInterview;