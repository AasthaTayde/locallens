const db = require("../config/db");

// Get owner dashboard
const getDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Find owner's store
        const [stores] = await db.query(
            `SELECT id, name, email, address
             FROM stores
             WHERE owner_id = ?`,
            [ownerId]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                message: "No store assigned to this owner"
            });
        }

        const store = stores[0];

        // Get average rating and total ratings
        const [[summary]] = await db.query(
            `SELECT
                COALESCE(AVG(rating), 0) AS average_rating,
                COUNT(*) AS total_ratings
             FROM ratings
             WHERE store_id = ?`,
            [store.id]
        );

        // Get rating distribution
        const [distribution] = await db.query(
            `SELECT
                rating,
                COUNT(*) AS count
             FROM ratings
             WHERE store_id = ?
             GROUP BY rating
             ORDER BY rating DESC`,
            [store.id]
        );

        // Get users who rated the store
        const [ratings] = await db.query(
            `SELECT
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                r.rating,
                r.created_at
             FROM ratings r
             JOIN users u ON r.user_id = u.id
             WHERE r.store_id = ?
             ORDER BY r.created_at DESC`,
            [store.id]
        );

        res.json({
            store,
            average_rating: summary.average_rating,
            total_ratings: summary.total_ratings,
            rating_distribution: distribution,
            ratings
        });

    } catch (error) {
        console.error("Owner dashboard error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getDashboard
};