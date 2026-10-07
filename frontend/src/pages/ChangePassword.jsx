import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:5000/api/auth/change-password",
                {
                    currentPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message || "Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to change password."
            );
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">LocalLens</div>

                <h1>Change password</h1>
                <p className="auth-subtitle">
                    Keep your account secure with a new password.
                </p>

                {message && (
                    <div className="auth-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label>Current password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />

                    <label>New password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="auth-submit">
                        Change password
                    </button>
                </form>

                <button
                    className="auth-back"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>
        </div>
    );
}

export default ChangePassword;