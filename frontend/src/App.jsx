
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePassword from "./pages/ChangePassword";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === "ADMIN") {
            return <Navigate to="/admin" replace />;
        }

        if (user.role === "OWNER") {
            return <Navigate to="/owner" replace />;
        }

        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={
                    <Home />
                } />

                <Route path="/login" element={
                    <Login />
                } />

                <Route path="/signup" element={
                    <Signup />
                } />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["USER"]}>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner"
                    element={
                        <ProtectedRoute allowedRoles={["OWNER"]}>
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute
                            allowedRoles={["USER", "OWNER", "ADMIN"]}
                        >
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

function Home() {
    return (
        <div className="home-page">

            <nav className="navbar">
                <div className="logo">LocalLens</div>

                <div className="nav-actions">
                    <a href="/login" className="nav-login">
                        Login
                    </a>

                    <a href="/signup" className="nav-button">
                        Get Started
                    </a>
                </div>
            </nav>

            <main className="hero">

                <section className="hero-content">
                    <p className="eyebrow">
                        LOCAL DISCOVERY
                    </p>

                    <h1>
                        Discover local.
                        <br />
                        Rate honestly.
                        <br />
                        Choose better.
                    </h1>

                    <p className="hero-description">
                        Find trusted local businesses through honest
                        ratings from people in your community.
                    </p>

                    <div className="hero-actions">
                        <a href="/signup" className="primary-button">
                            Start discovering
                        </a>

                        <a href="/login" className="secondary-button">
                            Sign in
                        </a>
                    </div>
                </section>

                <section className="hero-card">
                    <p className="hero-card-label">
                        TRENDING LOCAL
                    </p>

                    <h2>
                        Sunrise Coffee
                    </h2>

                    <div className="hero-rating">
                        ★ 4.8
                    </div>

                    <p>
                        FC Road, Pune
                    </p>

                    <div className="hero-card-footer">
                        <span>42 ratings</span>
                        <span className="badge">
                            Hidden Gem
                        </span>
                    </div>
                </section>

            </main>

            <section className="features">

                <div>
                    <strong>01</strong>
                    <h3>Discover</h3>
                    <p>
                        Find businesses worth trying.
                    </p>
                </div>

                <div>
                    <strong>02</strong>
                    <h3>Rate</h3>
                    <p>
                        Share your honest experience.
                    </p>
                </div>

                <div>
                    <strong>03</strong>
                    <h3>Choose</h3>
                    <p>
                        Make better local decisions.
                    </p>
                </div>

            </section>

        </div>
    );
}

export default App;

