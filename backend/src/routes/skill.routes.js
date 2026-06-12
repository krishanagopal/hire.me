const express = require("express");
const {
  addSkill,
  getMySkills,
  updateSkill,
  deleteSkill,
} = require("../controllers/skill.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/", addSkill);
router.get("/", getMySkills);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

module.exports = router;
