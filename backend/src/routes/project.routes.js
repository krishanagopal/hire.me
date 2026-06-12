const express = require("express");
const {
  addProject,
  getMyProjects,
  updateProject,
  deleteProject,
  featureProject,
} = require("../controllers/project.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/", addProject);
router.get("/", getMyProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.post("/:id/feature", featureProject);

module.exports = router;
