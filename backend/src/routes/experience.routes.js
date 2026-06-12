const express = require("express");
const {
  addExperience,
  getMyExperiences,
  updateExperience,
  deleteExperience,
} = require("../controllers/experience.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/", addExperience);
router.get("/", getMyExperiences);
router.put("/:id", updateExperience);
router.delete("/:id", deleteExperience);

module.exports = router;
