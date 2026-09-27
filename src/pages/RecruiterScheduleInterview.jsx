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

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // =====================================================
    // SCHEDULE INTERVIEW
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const token =
            localStorage.getItem("token");


        if (!token) {

            navigate("/login");

            return;
        }


        // Validation

        if (
            !formData.interviewDate ||
            !formData.interviewTime ||
            !formData.interviewerName ||
            !formData.meetingLink
        ) {

            alert(
                "Please fill all interview details."
            );

            return;
        }


        try {

            setLoading(true);


            const requestData = {

                applicationId:
                    Number(applicationId),

                interviewDate:
                    formData.interviewDate,

                interviewTime:
                    formData.interviewTime,

                interviewerName:
                    formData.interviewerName,

                meetingLink:
                    formData.meetingLink
            };


            console.log(
                "Scheduling Interview:",
                requestData
            );


            const response =
                await axios.post(

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


            // Go to recruiter interviews

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
    // UI
    // =====================================================

    return (

        <div style={styles.container}>

            {/* HEADER */}

            <header style={styles.header}>

                <h2>
                    Recruitment Portal
                </h2>


                <button
                    style={styles.logoutButton}
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>


            <div style={styles.layout}>

                {/* SIDEBAR */}

                <aside style={styles.sidebar}>

                    <h3>
                        Recruiter
                    </h3>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-dashboard"
                            )
                        }
                    >
                        🏠 Dashboard
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-jobs"
                            )
                        }
                    >
                        💼 Jobs
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-applicants"
                            )
                        }
                    >
                        👥 Applicants
                    </button>


                    <button
                        style={styles.activeMenuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-interviews"
                            )
                        }
                    >
                        📅 Interviews
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            navigate(
                                "/recruiter-profile"
                            )
                        }
                    >
                        👤 Profile
                    </button>

                </aside>


                {/* MAIN */}

                <main style={styles.main}>

                    <div style={styles.titleRow}>

                        <div>

                            <h1>
                                Schedule Interview
                            </h1>

                            <p style={styles.subtitle}>
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


                    {/* FORM */}

                    <form
                        style={styles.form}
                        onSubmit={handleSubmit}
                    >

                        {/* DATE */}

                        <div style={styles.formGroup}>

                            <label>
                                Interview Date
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
                                style={styles.input}
                            />

                        </div>


                        {/* TIME */}

                        <div style={styles.formGroup}>

                            <label>
                                Interview Time
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
                            />

                        </div>


                        {/* INTERVIEWER */}

                        <div style={styles.formGroup}>

                            <label>
                                Interviewer Name
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
                            />

                        </div>


                        {/* MEETING LINK */}

                        <div style={styles.formGroup}>

                            <label>
                                Meeting Link
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
                            />

                        </div>


                        {/* BUTTONS */}

                        <div style={styles.actions}>

                            <button
                                type="button"
                                style={styles.cancelButton}
                                onClick={() =>
                                    navigate(-1)
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                style={styles.scheduleButton}
                                disabled={loading}
                            >

                                {loading
                                    ? "Scheduling..."
                                    : "📅 Schedule Interview"}

                            </button>

                        </div>

                    </form>

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
        backgroundColor: "#f5f7fb",
        fontFamily: "Arial, sans-serif"
    },

    header: {
        height: "65px",
        backgroundColor: "#1e293b",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px"
    },

    logoutButton: {
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    layout: {
        display: "flex",
        minHeight: "calc(100vh - 65px)"
    },

    sidebar: {
        width: "220px",
        backgroundColor: "white",
        padding: "25px 15px",
        boxShadow:
            "2px 0 8px rgba(0,0,0,0.05)"
    },

    menuButton: {
        width: "100%",
        textAlign: "left",
        padding: "13px 15px",
        marginBottom: "8px",
        border: "none",
        backgroundColor: "transparent",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "15px"
    },

    activeMenuButton: {
        width: "100%",
        textAlign: "left",
        padding: "13px 15px",
        marginBottom: "8px",
        border: "none",
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "bold"
    },

    main: {
        flex: 1,
        padding: "35px"
    },

    titleRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
    },

    subtitle: {
        color: "#64748b"
    },

    backButton: {
        backgroundColor: "#64748b",
        color: "white",
        border: "none",
        padding: "11px 18px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    form: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        maxWidth: "700px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },

    formGroup: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px",
        gap: "8px"
    },

    input: {
        padding: "12px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        fontSize: "15px",
        outline: "none"
    },

    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "25px"
    },

    cancelButton: {
        backgroundColor: "#64748b",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    scheduleButton: {
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
    }
};


export default RecruiterScheduleInterview;