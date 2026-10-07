const db = require("../config/db");

// Add a rating
const createRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        const user_id = req.user.id;

        if (!store_id || !rating) {
            return res.status(400).json({
                message: "Store ID and rating are required"
            });
        }

        if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
            return res.status(400).json({
                message: "Rating must be an integer between 1 and 5"
            });
        }

        // Check store exists
        const [stores] = await db.query(
            "SELECT id FROM stores WHERE id = ?",
            [store_id]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        // Check if user already rated this store
        const [existingRating] = await db.query(
            "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
            [user_id, store_id]
        );

        if (existingRating.length > 0) {
            return res.status(409).json({
                message: "You have already rated this store"
            });
        }

        const [result] = await db.query(
            `INSERT INTO ratings (user_id, store_id, rating)
             VALUES (?, ?, ?)`,
            [user_id, store_id, rating]
        );

        res.status(201).json({
            message: "Rating submitted successfully",
            ratingId: result.insertId
        });

    } catch (error) {
        console.error("Create rating error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Update rating
const updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const user_id = req.user.id;

        if (!rating) {
            return res.status(400).json({
                message: "Rating is required"
            });
        }

        if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
            return res.status(400).json({
                message: "Rating must be an integer between 1 and 5"
            });
        }

        const [ratings] = await db.query(
            `SELECT id
             FROM ratings
             WHERE id = ? AND user_id = ?`,
            [id, user_id]
        );

        if (ratings.length === 0) {
            return res.status(404).json({
                message: "Rating not found"
            });
        }

        await db.query(
            `UPDATE ratings
             SET rating = ?
             WHERE id = ? AND user_id = ?`,
            [rating, id, user_id]
        );

        res.json({
            message: "Rating updated successfully"
        });

    } catch (error) {
        console.error("Update rating error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get ratings for a store
const getStoreRatings = async (req, res) => {
    try {
        const { storeId } = req.params;

        const [ratings] = await db.query(
            `SELECT
                r.id,
                r.rating,
                r.created_at,
                u.id AS user_id,
                u.name AS user_name
             FROM ratings r
             JOIN users u ON r.user_id = u.id
             WHERE r.store_id = ?
             ORDER BY r.created_at DESC`,
            [storeId]
        );

        res.json(ratings);

    } catch (error) {
        console.error("Get store ratings error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getMyRatings = async (req, res) => {
    try {
        const userId = req.user.id;

        const [ratings] = await db.query(
            `SELECT
                r.id,
                r.store_id,
                s.name AS store_name,
                r.rating,
                r.created_at,
                r.updated_at,
                COALESCE(
                    (
                        SELECT AVG(r2.rating)
                        FROM ratings r2
                        WHERE r2.store_id = r.store_id
                    ),
                    0
                ) AS average_rating
             FROM ratings r
             JOIN stores s
                ON r.store_id = s.id
             WHERE r.user_id = ?
             ORDER BY r.updated_at DESC`,
            [userId]
        );

        res.json(ratings);

    } catch (error) {
        console.error("Get my ratings error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createRating,
    updateRating,
    getStoreRatings,
    getMyRatings
};