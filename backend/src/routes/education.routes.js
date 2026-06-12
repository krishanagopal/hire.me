const express = require("express");
const {
  addEducation,
  getMyEducations,
  updateEducation,
  deleteEducation,
} = require("../controllers/education.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/", addEducation);
router.get("/", getMyEducations);
router.put("/:id", updateEducation);
router.delete("/:id", deleteEducation);

module.exports = router;
