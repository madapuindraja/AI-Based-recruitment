import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "CANDIDATE"
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const API_URL = "http://localhost:8085";

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
    };


    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {

            const response = await axios.post(
                `${API_URL}/api/auth/register`,
                formData
            );

            console.log(
                "Register Response:",
                response.data
            );

            setMessage(
                "Account created successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1800);

        } catch (err) {

            console.error(
                "Registration Error:",
                err
            );

            if (err.response) {

                setError(
                    err.response.data?.message ||
                    err.response.data ||
                    "Registration failed."
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="auth-page">


            {/* LEFT SHOWCASE */}

            <div className="auth-showcase register-showcase">

                <div className="showcase-content">

                    <div className="brand">

                        <div className="brand-icon">
                            RP
                        </div>

                        <span>
                            Recruitment Portal
                        </span>

                    </div>


                    <div className="showcase-main">

                        <span className="welcome-badge">
                            ✦ JOIN OUR PLATFORM
                        </span>

                        <h1>
                            Your next
                            <br />

                            <span className="gradient-text">
                                opportunity awaits.
                            </span>
                        </h1>

                        <p>
                            Create your account and take the next
                            step toward finding your dream opportunity
                            or building your next great team.
                        </p>


                        <div className="stats">

                            <div className="stat-card">

                                <strong>
                                    01
                                </strong>

                                <span>
                                    Create Profile
                                </span>

                            </div>

                            <div className="stat-line"></div>

                            <div className="stat-card">

                                <strong>
                                    02
                                </strong>

                                <span>
                                    Find Opportunities
                                </span>

                            </div>

                            <div className="stat-line"></div>

                            <div className="stat-card">

                                <strong>
                                    03
                                </strong>

                                <span>
                                    Get Hired
                                </span>

                            </div>

                        </div>


                        <div className="quote">

                            <span>
                                "
                            </span>

                            <p>
                                One platform. Better careers.
                                Smarter hiring.
                            </p>

                        </div>

                    </div>


                    <div className="showcase-footer">
                        © 2026 Recruitment Portal
                    </div>

                </div>


                <div className="circle circle-one"></div>
                <div className="circle circle-two"></div>
                <div className="circle circle-three"></div>

            </div>


            {/* REGISTER FORM */}

            <div className="auth-form-section">

                <div className="auth-card register-card">


                    <div className="mobile-brand">

                        <div className="brand-icon">
                            RP
                        </div>

                        <span>
                            Recruitment Portal
                        </span>

                    </div>


                    <div className="auth-heading">

                        <span className="small-heading">
                            GET STARTED
                        </span>

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Join thousands of candidates and recruiters
                        </p>

                    </div>


                    {error && (

                        <div className="auth-error">

                            <span>⚠</span>

                            <div>
                                {error}
                            </div>

                        </div>

                    )}


                    {message && (

                        <div className="auth-success">

                            <span>✓</span>

                            <div>
                                {message}
                            </div>

                        </div>

                    )}


                    <form onSubmit={handleRegister}>


                        {/* NAME */}

                        <div className="input-group">

                            <label>
                                Full Name
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    👤
                                </span>

                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="input-group">

                            <label>
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ✉
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="input-group">

                            <label>
                                Phone Number
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ☎
                                </span>

                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="input-group">

                            <label>
                                Password
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "🙈"
                                        : "👁"}
                                </button>

                            </div>

                        </div>


                        {/* ROLE */}

                        <div className="input-group">

                            <label>
                                I want to register as
                            </label>

                            <div className="role-selection">


                                <label
                                    className={
                                        formData.role ===
                                            "CANDIDATE"
                                            ? "role-option selected"
                                            : "role-option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="role"
                                        value="CANDIDATE"
                                        checked={
                                            formData.role ===
                                            "CANDIDATE"
                                        }
                                        onChange={handleChange}
                                    />

                                    <div className="role-content">

                                        <span className="role-icon">
                                            👨‍💼
                                        </span>

                                        <div>
                                            <strong>
                                                Candidate
                                            </strong>

                                            <small>
                                                Find jobs & build your career
                                            </small>
                                        </div>

                                    </div>

                                </label>


                                <label
                                    className={
                                        formData.role ===
                                            "RECRUITER"
                                            ? "role-option selected"
                                            : "role-option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="role"
                                        value="RECRUITER"
                                        checked={
                                            formData.role ===
                                            "RECRUITER"
                                        }
                                        onChange={handleChange}
                                    />

                                    <div className="role-content">

                                        <span className="role-icon">
                                            🏢
                                        </span>

                                        <div>
                                            <strong>
                                                Recruiter
                                            </strong>

                                            <small>
                                                Find talent & hire people
                                            </small>
                                        </div>

                                    </div>

                                </label>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="button-spinner"></span>
                                    Creating account...
                                </>

                            ) : (

                                <>
                                    Create Account
                                    <span className="arrow">
                                        →
                                    </span>
                                </>

                            )}

                        </button>


                    </form>


                    <div className="register-prompt">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Sign in
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;