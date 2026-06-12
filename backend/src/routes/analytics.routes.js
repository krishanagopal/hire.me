const express = require("express");
const {
  recordEvent,
  getAnalyticsSummary,
} = require("../controllers/analytics.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/event", recordEvent);
router.get("/summary", protect, getAnalyticsSummary);

module.exports = router;
