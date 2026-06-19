const express = require("express");
const { syncUser } = require("../controllers/auth.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

// Route to synchronize the authenticated Supabase user with MongoDB
router.post("/sync-user", protect, syncUser);

module.exports = router;
