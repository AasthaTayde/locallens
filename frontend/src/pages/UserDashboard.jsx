import { useEffect, useState } from "react";
import axios from "axios";

function UserDashboard() {
    const [stores, setStores] = useState([]);
    const [myRatings, setMyRatings] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("asc");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);
    const [editingRatingId, setEditingRatingId] = useState(null);

    const [ratingLoading, setRatingLoading] = useState(false);
    const [ratingMessage, setRatingMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const fetchStores = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/stores",
                {
                    params: {
                        search,
                        sortBy,
                        order
                    },
                    headers
                }
            );

            setStores(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load stores."
            );
        }
    };

    const fetchMyRatings = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/ratings/my",
                {
                    headers
                }
            );

            setMyRatings(response.data);
        } catch (error) {
            console.error("Unable to load ratings:", error);
        }
    };

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            await Promise.all([
                fetchStores(),
                fetchMyRatings()
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, [search, sortBy, order]);

    const getMyRating = (storeId) => {
        return myRatings.find(
            (rating) => Number(rating.store_id) === Number(storeId)
        );
    };

    const openRating = (store) => {
        const existingRating = getMyRating(store.id);

        setSelectedStore(store);

        if (existingRating) {
            setSelectedRating(existingRating.rating);
            setEditingRatingId(existingRating.id);
        } else {
            setSelectedRating(0);
            setEditingRatingId(null);
        }

        setRatingMessage("");
    };

    const closeRating = () => {
        setSelectedStore(null);
        setSelectedRating(0);
        setEditingRatingId(null);
        setRatingMessage("");
    };

    const submitRating = async () => {
        if (!selectedStore || selectedRating === 0) {
            return;
        }

        try {
            setRatingLoading(true);
            setRatingMessage("");

            if (editingRatingId) {
                await axios.patch(
                    `http://localhost:5000/api/ratings/${editingRatingId}`,
                    {
                        rating: selectedRating
                    },
                    {
                        headers
                    }
                );

                setRatingMessage(
                    "Rating updated successfully!"
                );
            } else {
                await axios.post(
                    "http://localhost:5000/api/ratings",
                    {
                        store_id: selectedStore.id,
                        rating: selectedRating
                    },
                    {
                        headers
                    }
                );

                setRatingMessage(
                    "Rating submitted successfully!"
                );
            }

            await loadDashboard();

            setTimeout(() => {
                closeRating();
            }, 1000);

        } catch (error) {
            setRatingMessage(
                error.response?.data?.message ||
                "Unable to save rating."
            );
        } finally {
            setRatingLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";
    };

    return (
        <div className="dashboard-page">

            {/* NAVBAR */}
            <nav className="dashboard-navbar">

                <div className="logo">
                    LocalLens
                </div>

                <div className="dashboard-nav-right">

                    <span>
                        Welcome, {user?.name || "User"}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* MAIN CONTENT */}
            <main className="dashboard-content">

                {/* HEADING */}
                <section className="dashboard-heading">

                    <p className="eyebrow">
                        LOCAL DISCOVERY
                    </p>

                    <h1>
                        Discover local businesses
                    </h1>

                    <p>
                        Find places people actually recommend.
                    </p>

                </section>

                {/* SEARCH + SORT */}
                <section className="store-controls">

                    <div className="search-box">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search businesses..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                    <div className="sort-controls">

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value)
                            }
                        >
                            <option value="name">
                                Sort by Name
                            </option>

                            <option value="rating">
                                Sort by Rating
                            </option>

                            <option value="ratings">
                                Sort by Number of Ratings
                            </option>
                        </select>

                        <button
                            onClick={() =>
                                setOrder(
                                    order === "asc"
                                        ? "desc"
                                        : "asc"
                                )
                            }
                            className="sort-btn"
                        >
                            {order === "asc"
                                ? "↑ Ascending"
                                : "↓ Descending"}
                        </button>

                    </div>

                </section>

                {/* ERROR */}
                {error && (
                    <div className="dashboard-error">
                        {error}
                    </div>
                )}

                {/* LOADING */}
                {loading && (
                    <div className="dashboard-loading">
                        Loading local businesses...
                    </div>
                )}

                {/* EMPTY */}
                {!loading && stores.length === 0 && (
                    <div className="empty-state">

                        <h2>
                            No businesses found
                        </h2>

                        <p>
                            Try searching for another business.
                        </p>

                    </div>
                )}

                {/* STORE CARDS */}
                {!loading && stores.length > 0 && (

                    <section className="store-grid">

                        {stores.map((store) => {

                            const myRating = getMyRating(store.id);

                            return (
                                <article
                                    className="store-card"
                                    key={store.id}
                                >

                                    <div className="store-card-top">

                                        <div className="store-icon">
                                            {store.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="store-rating">
                                            ★{" "}
                                            {Number(
                                                store.average_rating || 0
                                            ).toFixed(1)}
                                        </div>

                                    </div>

                                    <h2>
                                        {store.name}
                                    </h2>

                                    <p className="store-address">
                                        {store.address}
                                    </p>

                                    <div className="store-meta">

                                        <span>
                                            {store.total_ratings || 0} ratings
                                        </span>

                                        {Number(
                                            store.average_rating || 0
                                        ) >= 4.5 &&
                                            Number(
                                                store.total_ratings || 0
                                            ) < 50 && (

                                                <span className="badge">
                                                    Hidden Gem
                                                </span>

                                            )}

                                    </div>

                                    {myRating && (
                                        <div className="my-rating">
                                            Your rating:{" "}
                                            <strong>
                                                {myRating.rating}/5
                                            </strong>
                                        </div>
                                    )}

                                    <button
                                        className="rate-btn"
                                        onClick={() =>
                                            openRating(store)
                                        }
                                    >
                                        {myRating
                                            ? "Modify Rating"
                                            : "Rate Store"}
                                    </button>

                                </article>
                            );
                        })}

                    </section>
                )}

                {/* RATING MODAL */}
                {selectedStore && (

                    <div className="rating-overlay">

                        <div className="rating-modal">

                            <button
                                className="rating-close"
                                onClick={closeRating}
                            >
                                ×
                            </button>

                            <p className="eyebrow">
                                {editingRatingId
                                    ? "MODIFY YOUR RATING"
                                    : "RATE THIS STORE"}
                            </p>

                            <h2>
                                {selectedStore.name}
                            </h2>

                            <p className="rating-subtitle">
                                How was your experience?
                            </p>

                            <div className="star-rating">

                                {[1, 2, 3, 4, 5].map((star) => (

                                    <button
                                        key={star}
                                        type="button"
                                        className={
                                            star <= selectedRating
                                                ? "star active"
                                                : "star"
                                        }
                                        onClick={() =>
                                            setSelectedRating(star)
                                        }
                                    >
                                        ★
                                    </button>

                                ))}

                            </div>

                            <p className="rating-value">

                                {selectedRating === 0
                                    ? "Select a rating"
                                    : `${selectedRating} out of 5`}

                            </p>

                            {ratingMessage && (
                                <div className="rating-message">
                                    {ratingMessage}
                                </div>
                            )}

                            <button
                                className="submit-rating-btn"
                                disabled={
                                    selectedRating === 0 ||
                                    ratingLoading
                                }
                                onClick={submitRating}
                            >
                                {ratingLoading
                                    ? "Saving..."
                                    : editingRatingId
                                        ? "Update Rating"
                                        : "Submit Rating"}
                            </button>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default UserDashboard;