const express = require("express");

const {
  googleLogin,
  githubLogin,
  sendOtp,
  verifyOtp,
  getMe,
} = require("../controllers/auth.controller");

const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/google", googleLogin);
router.post("/github", githubLogin);
router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);
router.get("/me", protect, getMe);

module.exports = router;