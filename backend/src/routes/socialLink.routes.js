const express = require("express");
const {
  getMySocialLinks,
  updateMySocialLinks,
} = require("../controllers/socialLink.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/me", getMySocialLinks);
router.put("/me", updateMySocialLinks);

module.exports = router;
