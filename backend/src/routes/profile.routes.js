const express = require("express");
const {
  checkUsername,
  claimUsername,
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
  getMediaFile,
} = require("../controllers/profile.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

// Username Claim Routes
router.get("/username/check", checkUsername);
router.post("/username/claim", protect, claimUsername);

// Media retrieval stream route
router.get("/media/:id", getMediaFile);

// Profile detail routes
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/:username", getPublicProfile);

module.exports = router;
