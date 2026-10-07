const express = require("express");

const {
    createRating,
    updateRating,
    getStoreRatings,
    getMyRatings
} = require("../controllers/ratingController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Normal users can submit ratings
router.post(
    "/",
    authenticateToken,
    authorizeRoles("USER"),
    createRating
);

// Normal users can update their own ratings
router.patch(
    "/:id",
    authenticateToken,
    authorizeRoles("USER"),
    updateRating
);
router.get(
    "/my",
    authenticateToken,
    authorizeRoles("USER"),
    getMyRatings
);


// Logged-in users can view ratings for a store
router.get(
    "/store/:storeId",
    authenticateToken,
    getStoreRatings
);

module.exports = router;