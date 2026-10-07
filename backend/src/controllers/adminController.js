const db = require("../config/db");

// Get admin dashboard statistics
const getStats = async (req, res) => {
    try {
        const [[userCount]] = await db.query(
            "SELECT COUNT(*) AS total_users FROM users"
        );

        const [[storeCount]] = await db.query(
            "SELECT COUNT(*) AS total_stores FROM stores"
        );

        const [[ratingCount]] = await db.query(
            "SELECT COUNT(*) AS total_ratings FROM ratings"
        );

        const [[ownerCount]] = await db.query(
            "SELECT COUNT(*) AS total_owners FROM users WHERE role = 'OWNER'"
        );

        res.json({
            total_users: userCount.total_users,
            total_stores: storeCount.total_stores,
            total_ratings: ratingCount.total_ratings,
            total_owners: ownerCount.total_owners
        });

    } catch (error) {
        console.error("Get admin stats error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get all users
const getUsers = async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT
                id,
                name,
                email,
                address,
                role,
                created_at
            FROM users
            ORDER BY name ASC
        `);

        res.json(users);

    } catch (error) {
        console.error("Get admin users error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get all stores with owner and rating information
const getStores = async (req, res) => {
    try {
        const [stores] = await db.query(`
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                u.name AS owner_name,
                COALESCE(AVG(r.rating), 0) AS average_rating,
                COUNT(r.id) AS total_ratings
            FROM stores s
            LEFT JOIN users u
                ON s.owner_id = u.id
            LEFT JOIN ratings r
                ON s.id = r.store_id
            GROUP BY s.id
            ORDER BY s.name ASC
        `);

        res.json(stores);

    } catch (error) {
        console.error("Get admin stores error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// Create a new user, owner, or admin
const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            address,
            role
        } = req.body;

        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message: "Name must be between 20 and 60 characters"
            });
        }

        if (address.length > 400) {
            return res.status(400).json({
                message: "Address cannot exceed 400 characters"
            });
        }

        const allowedRoles = ["USER", "OWNER", "ADMIN"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
            });
        }

        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const bcrypt = require("bcryptjs");

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const [result] = await db.query(
            `INSERT INTO users
            (name, email, password, address, role)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                address,
                role
            ]
        );

        res.status(201).json({
            message: "User created successfully",
            userId: result.insertId
        });

    } catch (error) {
        console.error("Create user error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Assign an owner to a store
const assignStoreOwner = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { owner_id } = req.body;

        if (!owner_id) {
            return res.status(400).json({
                message: "Owner ID is required"
            });
        }

        const [owners] = await db.query(
            `SELECT id
             FROM users
             WHERE id = ? AND role = 'OWNER'`,
            [owner_id]
        );

        if (owners.length === 0) {
            return res.status(404).json({
                message: "Owner not found"
            });
        }

        const [stores] = await db.query(
            "SELECT id FROM stores WHERE id = ?",
            [storeId]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        await db.query(
            "UPDATE stores SET owner_id = ? WHERE id = ?",
            [owner_id, storeId]
        );

        res.json({
            message: "Store owner assigned successfully"
        });

    } catch (error) {
        console.error("Assign store owner error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getStats,
    getUsers,
    getStores,
    createUser,
    assignStoreOwner
};