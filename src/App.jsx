import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import CandidateDashboard from "./pages/CandidateDashboard";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import Interviews from "./pages/Interviews";

import RecruiterJobs from "./pages/RecruiterJobs";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterApplicants from "./pages/RecruiterApplicants";
import RecruiterScheduleInterview from "./pages/RecruiterScheduleInterview";
import RecruiterInterviews from "./pages/RecruiterInterviews";
import RecruiterProfile from "./pages/RecruiterProfile";
import Profile from "./pages/Profile";
function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    LOGIN
                ========================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =========================
                    REGISTER
                ========================= */}

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    CANDIDATE
                ========================= */}

                <Route
                    path="/candidate-dashboard"
                    element={<CandidateDashboard />}
                />

                <Route
                    path="/jobs"
                    element={<Jobs />}
                />

                <Route
                    path="/my-applications"
                    element={<MyApplications />}
                />

                <Route
                    path="/interviews"
                    element={<Interviews />}
                />


                {/* =========================
                    RECRUITER
                ========================= */}

                <Route
                    path="/recruiter-dashboard"
                    element={<RecruiterDashboard />}
                />

                <Route
                    path="/recruiter-jobs"
                    element={<RecruiterJobs />}
                />


                {/* ALL APPLICANTS */}

                <Route
                    path="/recruiter-applicants"
                    element={<RecruiterApplicants />}
                />


                {/* APPLICANTS FOR ONE JOB */}

                <Route
                    path="/recruiter-applicants/:jobId"
                    element={<RecruiterApplicants />}
                />


                {/* RECRUITER INTERVIEWS */}

                <Route
                    path="/recruiter-interviews"
                    element={<RecruiterInterviews />}
                />


                {/* SCHEDULE INTERVIEW */}

                <Route
                    path="/recruiter-interviews/:applicationId"
                    element={<RecruiterScheduleInterview />}
                /> 
                <Route
    path="/recruiter-profile"
    element={<RecruiterProfile />}
/>
<Route
    path="/profile"
    element={<Profile />}
/>

            </Routes>

        </BrowserRouter>
    );
}

export default App;