const express = require("express");
const {
  checkUsername,
  claimUsername,
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
} = require("../controllers/profile.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

// Username Claim Routes
router.get("/username/check", checkUsername);
router.post("/username/claim", protect, claimUsername);

// Profile detail routes
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/:username", getPublicProfile);

module.exports = router;
