const express = require("express");

const {
    getStats,
    getUsers,
    getStores,
    createUser,
    assignStoreOwner
} = require("../controllers/adminController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin dashboard statistics
router.get(
    "/stats",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getStats
);

// Get all users
router.get(
    "/users",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getUsers
);

// Get all stores
router.get(
    "/stores",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getStores
);

router.post(
    "/users",
    authenticateToken,
    authorizeRoles("ADMIN"),
    createUser
);

router.patch(
    "/stores/:storeId/owner",
    authenticateToken,
    authorizeRoles("ADMIN"),
    assignStoreOwner
);

module.exports = router;