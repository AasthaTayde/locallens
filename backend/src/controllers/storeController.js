const db = require("../config/db");

// Get all stores
const getStores = async (req, res) => {
    try {
        const {
            search = "",
            sortBy = "name",
            order = "asc"
        } = req.query;

        const allowedSortFields = {
            name: "s.name",
            rating: "average_rating",
            ratings: "total_ratings"
        };

        const sortField =
            allowedSortFields[sortBy] || allowedSortFields.name;

        const sortOrder =
            order.toLowerCase() === "desc" ? "DESC" : "ASC";

        const searchValue = `%${search}%`;

        const [stores] = await db.query(
            `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                COALESCE(AVG(r.rating), 0) AS average_rating,
                COUNT(r.id) AS total_ratings
            FROM stores s
            LEFT JOIN ratings r
                ON s.id = r.store_id
            WHERE
                s.name LIKE ?
                OR s.address LIKE ?
                OR s.email LIKE ?
            GROUP BY s.id
            ORDER BY ${sortField} ${sortOrder}
            `,
            [searchValue, searchValue, searchValue]
        );

        res.json(stores);

    } catch (error) {
        console.error("Get stores error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get single store
const getStoreById = async (req, res) => {
    try {
        const { id } = req.params;

        const [stores] = await db.query(
            `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                COALESCE(AVG(r.rating), 0) AS average_rating,
                COUNT(r.id) AS total_ratings
            FROM stores s
            LEFT JOIN ratings r
                ON s.id = r.store_id
            WHERE s.id = ?
            GROUP BY s.id
            `,
            [id]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        res.json(stores[0]);

    } catch (error) {
        console.error("Get store error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Create store
const createStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;

        if (!name || !email || !address) {
            return res.status(400).json({
                message: "Name, email and address are required"
            });
        }

        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message: "Store name must be between 20 and 60 characters"
            });
        }

        if (address.length > 400) {
            return res.status(400).json({
                message: "Address cannot exceed 400 characters"
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO stores
            (name, email, address, owner_id)
            VALUES (?, ?, ?, ?)
            `,
            [name, email, address, owner_id || null]
        );

        res.status(201).json({
            message: "Store created successfully",
            storeId: result.insertId
        });

    } catch (error) {
        console.error("Create store error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getStores,
    getStoreById,
    createStore
};