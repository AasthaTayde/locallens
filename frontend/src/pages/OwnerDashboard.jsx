import { useEffect, useState } from "react";
import axios from "axios";

function OwnerDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/owner/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDashboard(response.data);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load owner dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-loading">
                    Loading owner dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            {/* NAVBAR */}
            <nav className="dashboard-navbar">

                <div className="logo">
                    LocalLens
                </div>

                <div className="dashboard-nav-right">

                    <span>
                        Welcome, {user?.name || "Owner"}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>

                </div>

            </nav>

            <main className="dashboard-content">

                {/* HEADING */}
                <section className="dashboard-heading">

                    <p className="eyebrow">
                        OWNER INSIGHTS
                    </p>

                    <h1>
                        Your business performance
                    </h1>

                    <p>
                        Understand how customers are rating your business.
                    </p>

                </section>

                {/* ERROR */}
                {error && (
                    <div className="dashboard-error">
                        {error}
                    </div>
                )}

                {/* STORES */}
                {dashboard?.stores?.map((store) => (

                    <section
                        className="owner-store-section"
                        key={store.id}
                    >

                        {/* STORE HEADER */}
                        <div className="owner-store-header">

                            <div>
                                <p className="eyebrow">
                                    YOUR STORE
                                </p>

                                <h2>
                                    {store.name}
                                </h2>

                                <p>
                                    {store.address}
                                </p>
                            </div>

                            <div className="owner-average">

                                <span className="owner-star">
                                    ★
                                </span>

                                <strong>
                                    {Number(
                                        store.average_rating || 0
                                    ).toFixed(1)}
                                </strong>

                                <small>
                                    Average rating
                                </small>

                            </div>

                        </div>

                        {/* STAT CARDS */}
                        <div className="owner-stats">

                            <div className="owner-stat-card">
                                <span>Total Ratings</span>
                                <strong>
                                    {store.total_ratings || 0}
                                </strong>
                            </div>

                            <div className="owner-stat-card">
                                <span>5 Star Ratings</span>
                                <strong>
                                    {store.rating_distribution?.[5] || 0}
                                </strong>
                            </div>

                            <div className="owner-stat-card">
                                <span>4 Star Ratings</span>
                                <strong>
                                    {store.rating_distribution?.[4] || 0}
                                </strong>
                            </div>

                        </div>

                        {/* RATING DISTRIBUTION */}
                        <div className="owner-panel">

                            <div className="owner-panel-header">

                                <div>
                                    <p className="eyebrow">
                                        RATING BREAKDOWN
                                    </p>

                                    <h3>
                                        Customer ratings
                                    </h3>
                                </div>

                            </div>

                            <div className="rating-distribution">

                                {[5, 4, 3, 2, 1].map((rating) => {

                                    const count =
                                        store.rating_distribution?.[rating] || 0;

                                    const total =
                                        store.total_ratings || 0;

                                    const percentage =
                                        total > 0
                                            ? (count / total) * 100
                                            : 0;

                                    return (
                                        <div
                                            className="rating-row"
                                            key={rating}
                                        >

                                            <span>
                                                {rating} ★
                                            </span>

                                            <div className="rating-bar">
                                                <div
                                                    className="rating-bar-fill"
                                                    style={{
                                                        width: `${percentage}%`
                                                    }}
                                                />
                                            </div>

                                            <strong>
                                                {count}
                                            </strong>

                                        </div>
                                    );
                                })}

                            </div>

                        </div>

                        {/* CUSTOMER RATINGS */}
                        <div className="owner-panel">

                            <div className="owner-panel-header">

                                <div>
                                    <p className="eyebrow">
                                        CUSTOMER FEEDBACK
                                    </p>

                                    <h3>
                                        People who rated your store
                                    </h3>
                                </div>

                            </div>

                            {store.ratings?.length > 0 ? (

                                <div className="owner-rating-list">

                                    {store.ratings.map((rating) => (

                                        <div
                                            className="owner-rating-item"
                                            key={rating.id}
                                        >

                                            <div className="owner-user-avatar">
                                                {rating.user_name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="owner-user-info">

                                                <strong>
                                                    {rating.user_name}
                                                </strong>

                                                <span>
                                                    {rating.user_email}
                                                </span>

                                            </div>

                                            <div className="owner-user-rating">
                                                ★ {rating.rating}/5
                                            </div>

                                        </div>

                                    ))}

                                </div>

                            ) : (

                                <div className="owner-empty">
                                    No ratings yet.
                                </div>

                            )}

                        </div>

                    </section>

                ))}

                {/* NO STORES */}
                {!dashboard?.stores?.length && (
                    <div className="empty-state">

                        <h2>
                            No store assigned
                        </h2>

                        <p>
                            Your account is not currently assigned to a store.
                        </p>

                    </div>
                )}

            </main>

        </div>
    );
}

export default OwnerDashboard;