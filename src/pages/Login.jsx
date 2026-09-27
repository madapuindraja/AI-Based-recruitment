import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const API_URL = "http://localhost:8085";

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                {
                    email,
                    password
                }
            );

            console.log("Login response:", response.data);

            if (response.data.token) {
                localStorage.setItem(
                    "token",
                    response.data.token
                );
            }

            if (response.data.role) {
                localStorage.setItem(
                    "role",
                    response.data.role
                );
            }

            if (response.data.role === "CANDIDATE") {

                navigate("/candidate-dashboard");

            } else if (response.data.role === "RECRUITER") {

                navigate("/recruiter-dashboard");

            } else {

                navigate("/");

            }

        } catch (err) {

            console.error("Login error:", err);

            if (err.response) {

                setError(
                    err.response.data?.message ||
                    "Invalid email or password."
                );

            } else if (err.request) {

                setError(
                    "Unable to connect to the server. Please check that Spring Boot is running."
                );

            } else {

                setError(
                    "Something went wrong. Please try again."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="auth-page">

            {/* LEFT SIDE */}

            <div className="auth-showcase">

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
                            ✦ SMART RECRUITMENT PLATFORM
                        </span>

                        <h1>
                            Find the right
                            <br />

                            <span className="gradient-text">
                                talent faster.
                            </span>
                        </h1>

                        <p>
                            Connect candidates with opportunities
                            and help recruiters build exceptional
                            teams with a smarter hiring experience.
                        </p>

                        <div className="feature-list">

                            <div className="feature-item">
                                <span className="feature-icon">
                                    ✓
                                </span>

                                <div>
                                    <strong>
                                        Smart Job Matching
                                    </strong>

                                    <small>
                                        Discover opportunities that
                                        match your skills.
                                    </small>
                                </div>
                            </div>

                            <div className="feature-item">
                                <span className="feature-icon">
                                    ✓
                                </span>

                                <div>
                                    <strong>
                                        Simple Application Tracking
                                    </strong>

                                    <small>
                                        Track applications and interviews
                                        in one place.
                                    </small>
                                </div>
                            </div>

                            <div className="feature-item">
                                <span className="feature-icon">
                                    ✓
                                </span>

                                <div>
                                    <strong>
                                        Faster Hiring
                                    </strong>

                                    <small>
                                        Recruiters can manage candidates
                                        efficiently.
                                    </small>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="showcase-footer">
                        © 2026 Recruitment Portal
                    </div>

                </div>

                {/* Decorative circles */}

                <div className="circle circle-one"></div>
                <div className="circle circle-two"></div>
                <div className="circle circle-three"></div>

            </div>


            {/* RIGHT SIDE */}

            <div className="auth-form-section">

                <div className="auth-card">

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
                            WELCOME BACK
                        </span>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p>
                            Enter your credentials to continue
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


                    <form onSubmit={handleLogin}>

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
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <div className="input-group">

                            <div className="label-row">

                                <label>
                                    Password
                                </label>

                                <span className="forgot">
                                    Forgot password?
                                </span>

                            </div>

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
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
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


                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="button-spinner"></span>
                                    Signing in...
                                </>

                            ) : (

                                <>
                                    Sign In
                                    <span className="arrow">
                                        →
                                    </span>
                                </>

                            )}

                        </button>

                    </form>


                    <div className="divider">
                        <span>OR</span>
                    </div>


                    <div className="register-prompt">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create an account
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;