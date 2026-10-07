require("dotenv").config();
const {
    authenticateToken,
    authorizeRoles
} = require("./middleware/authMiddleware");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "LocalLens API is running"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS result");

        res.json({
            message: "MySQL connection successful",
            database: rows[0].result === 1
        });
    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.get(
    "/api/protected",
    authenticateToken,
    (req, res) => {
        res.json({
            message: "You accessed a protected route",
            user: req.user
        });
    }
);

app.get(
    "/api/admin-test",
    authenticateToken,
    authorizeRoles("ADMIN"),
    (req, res) => {
        res.json({
            message: "Welcome Admin!"
        });
    }
);

app.listen(PORT, () => {
    console.log(`LocalLens server running on port ${PORT}`);
});