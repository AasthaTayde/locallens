
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function AdminDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showUserForm, setShowUserForm] = useState(false);
    const [showStoreForm, setShowStoreForm] = useState(false);

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER"
    });

    const [storeForm, setStoreForm] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [statsResponse, usersResponse, storesResponse] =
                await Promise.all([
                    axios.get(`${API}/admin/stats`, { headers }),
                    axios.get(`${API}/admin/users`, { headers }),
                    axios.get(`${API}/admin/stores`, { headers })
                ]);

            setStats(statsResponse.data || {});
            setUsers(usersResponse.data || []);
            setStores(storesResponse.data || []);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load admin dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";
    };

    const handleUserChange = (e) => {
        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value
        });
    };

    const handleStoreChange = (e) => {
        setStoreForm({
            ...storeForm,
            [e.target.name]: e.target.value
        });
    };

    const createUser = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setMessage("");

            await axios.post(
                `${API}/admin/users`,
                userForm,
                { headers }
            );

            setMessage("User created successfully.");

            setUserForm({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "USER"
            });

            setShowUserForm(false);

            await loadDashboard();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create user."
            );
        }
    };

    const createStore = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setMessage("");

            await axios.post(
                `${API}/stores`,
                {
                    name: storeForm.name,
                    email: storeForm.email,
                    address: storeForm.address,
                    owner_id: storeForm.owner_id
                        ? Number(storeForm.owner_id)
                        : null
                },
                { headers }
            );

            setMessage("Store created successfully.");

            setStoreForm({
                name: "",
                email: "",
                address: "",
                owner_id: ""
            });

            setShowStoreForm(false);

            await loadDashboard();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create store."
            );
        }
    };

    const assignOwner = async (storeId, ownerId) => {
        try {
            setError("");
            setMessage("");

            await axios.patch(
                `${API}/admin/stores/${storeId}/owner`,
                {
                    owner_id: Number(ownerId)
                },
                { headers }
            );

            setMessage("Store owner updated.");

            await loadDashboard();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to assign owner."
            );
        }
    };

    const filteredUsers = users.filter((item) => {
        const value = search.toLowerCase();

        return (
            item.name?.toLowerCase().includes(value) ||
            item.email?.toLowerCase().includes(value) ||
            item.role?.toLowerCase().includes(value)
        );
    });

    const filteredStores = stores.filter((item) => {
        const value = search.toLowerCase();

        return (
            item.name?.toLowerCase().includes(value) ||
            item.email?.toLowerCase().includes(value) ||
            item.address?.toLowerCase().includes(value)
        );
    });

    const owners = users.filter(
        (item) => item.role === "OWNER"
    );

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-loading">
                    Loading admin dashboard...
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
                        Welcome, {user?.name || "Admin"}
                    </span>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            <main className="dashboard-content">

                {/* HEADER */}
                <section className="dashboard-heading">

                    <p className="eyebrow">
                        ADMIN CONTROL CENTER
                    </p>

                    <h1>
                        Manage LocalLens
                    </h1>

                    <p>
                        Monitor users, businesses and platform activity.
                    </p>

                </section>


                {error && (
                    <div className="dashboard-error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="admin-success">
                        {message}
                    </div>
                )}


                {/* STATISTICS */}
                <section className="admin-stats">

                    <div className="admin-stat-card">
                        <span>Total Users</span>
                        <strong>
                            {stats.total_users || 0}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Total Stores</span>
                        <strong>
                            {stats.total_stores || 0}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Total Ratings</span>
                        <strong>
                            {stats.total_ratings || 0}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Store Owners</span>
                        <strong>
                            {stats.total_owners || 0}
                        </strong>
                    </div>

                </section>


                {/* ACTIONS */}
                <section className="admin-actions">

                    <button
                        className="admin-primary-btn"
                        onClick={() =>
                            setShowUserForm(!showUserForm)
                        }
                    >
                        + Add User
                    </button>

                    <button
                        className="admin-secondary-btn"
                        onClick={() =>
                            setShowStoreForm(!showStoreForm)
                        }
                    >
                        + Add Store
                    </button>

                </section>


                {/* ADD USER */}
                {showUserForm && (
                    <section className="admin-form-panel">

                        <div className="owner-panel-header">
                            <p className="eyebrow">
                                NEW USER
                            </p>

                            <h3>
                                Add platform user
                            </h3>
                        </div>

                        <form
                            className="admin-form"
                            onSubmit={createUser}
                        >

                            <input
                                name="name"
                                placeholder="Full name"
                                value={userForm.name}
                                onChange={handleUserChange}
                                required
                            />

                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={userForm.email}
                                onChange={handleUserChange}
                                required
                            />

                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={userForm.password}
                                onChange={handleUserChange}
                                required
                            />

                            <input
                                name="address"
                                placeholder="Address"
                                value={userForm.address}
                                onChange={handleUserChange}
                                required
                            />

                            <select
                                name="role"
                                value={userForm.role}
                                onChange={handleUserChange}
                            >
                                <option value="USER">
                                    Normal User
                                </option>

                                <option value="OWNER">
                                    Store Owner
                                </option>

                                <option value="ADMIN">
                                    Administrator
                                </option>
                            </select>

                            <button
                                type="submit"
                                className="admin-primary-btn"
                            >
                                Create User
                            </button>

                        </form>

                    </section>
                )}


                {/* ADD STORE */}
                {showStoreForm && (
                    <section className="admin-form-panel">

                        <div className="owner-panel-header">

                            <p className="eyebrow">
                                NEW STORE
                            </p>

                            <h3>
                                Add local business
                            </h3>

                        </div>

                        <form
                            className="admin-form"
                            onSubmit={createStore}
                        >

                            <input
                                name="name"
                                placeholder="Store name"
                                value={storeForm.name}
                                onChange={handleStoreChange}
                                required
                            />

                            <input
                                name="email"
                                type="email"
                                placeholder="Store email"
                                value={storeForm.email}
                                onChange={handleStoreChange}
                                required
                            />

                            <input
                                name="address"
                                placeholder="Store address"
                                value={storeForm.address}
                                onChange={handleStoreChange}
                                required
                            />

                            <select
                                name="owner_id"
                                value={storeForm.owner_id}
                                onChange={handleStoreChange}
                            >

                                <option value="">
                                    No owner
                                </option>

                                {owners.map((owner) => (
                                    <option
                                        key={owner.id}
                                        value={owner.id}
                                    >
                                        {owner.name}
                                    </option>
                                ))}

                            </select>

                            <button
                                type="submit"
                                className="admin-primary-btn"
                            >
                                Create Store
                            </button>

                        </form>

                    </section>
                )}


                {/* SEARCH */}
                <section className="admin-search">

                    <div className="search-box">

                        <span>⌕</span>

                        <input
                            placeholder="Search users and stores..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </section>


                {/* USERS */}
                <section className="admin-panel">

                    <div className="admin-panel-header">

                        <div>
                            <p className="eyebrow">
                                USERS
                            </p>

                            <h2>
                                Platform users
                            </h2>
                        </div>

                        <span>
                            {filteredUsers.length} users
                        </span>

                    </div>

                    <div className="admin-table">

                        <div className="admin-table-row admin-table-head">

                            <span>Name</span>
                            <span>Email</span>
                            <span>Role</span>
                            <span>Address</span>

                        </div>

                        {filteredUsers.map((item) => (

                            <div
                                className="admin-table-row"
                                key={item.id}
                            >

                                <span>
                                    {item.name}
                                </span>

                                <span>
                                    {item.email}
                                </span>

                                <span>
                                    <b className="role-badge">
                                        {item.role}
                                    </b>
                                </span>

                                <span>
                                    {item.address}
                                </span>

                            </div>

                        ))}

                    </div>

                </section>


                {/* STORES */}
                <section className="admin-panel">

                    <div className="admin-panel-header">

                        <div>
                            <p className="eyebrow">
                                STORES
                            </p>

                            <h2>
                                Managed businesses
                            </h2>
                        </div>

                        <span>
                            {filteredStores.length} stores
                        </span>

                    </div>


                    <div className="admin-store-list">

                        {filteredStores.map((store) => (

                            <div
                                className="admin-store-item"
                                key={store.id}
                            >

                                <div className="admin-store-main">

                                    <div className="store-icon">
                                        {store.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>

                                        <h3>
                                            {store.name}
                                        </h3>

                                        <p>
                                            {store.address}
                                        </p>

                                        <small>
                                            ★{" "}
                                            {Number(
                                                store.average_rating || 0
                                            ).toFixed(1)}
                                            {" · "}
                                            {store.total_ratings || 0} ratings
                                        </small>

                                    </div>

                                </div>


                                <div className="admin-owner-control">

                                    <label>
                                        Owner
                                    </label>

                                    <select
                                        value={
                                            store.owner_id || ""
                                        }
                                        onChange={(e) =>
                                            assignOwner(
                                                store.id,
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            No owner
                                        </option>

                                        {owners.map((owner) => (

                                            <option
                                                key={owner.id}
                                                value={owner.id}
                                            >
                                                {owner.name}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;

