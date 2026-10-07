const express = require("express");

const {
    getStores,
    getStoreById,
    createStore
} = require("../controllers/storeController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// Anyone logged in can view stores
router.get(
    "/",
    authenticateToken,
    getStores
);


// Anyone logged in can view one store
router.get(
    "/:id",
    authenticateToken,
    getStoreById
);


// Only Admin can create stores
router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN"),
    createStore
);


module.exports = router;