import { useState } from "react";
import axios from "axios";

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name: formData.name,
                    email: formData.email,
                    address: formData.address,
                    password: formData.password
                }
            );

            setSuccess(
                "Account created successfully. You can now login."
            );

            setFormData({
                name: "",
                email: "",
                address: "",
                password: "",
                confirmPassword: ""
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">
                    LocalLens<span>.</span>
                </div>

                <h1>Create account</h1>

                <p className="auth-subtitle">
                    Join LocalLens and help your community
                    discover better local businesses.
                </p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="auth-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Full Name</label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />

                    <label>Address</label>

                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="8-16 characters"
                        required
                    />

                    <label>Confirm Password</label>

                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                    />

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                    >
                        Sign in
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Signup;