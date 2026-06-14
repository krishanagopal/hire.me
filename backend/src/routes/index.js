const express = require("express");

const profileRoutes = require("./profile.routes");
const skillRoutes = require("./skill.routes");
const socialLinkRoutes = require("./socialLink.routes");
const projectRoutes = require("./project.routes");
const experienceRoutes = require("./experience.routes");
const educationRoutes = require("./education.routes");
const certificationRoutes = require("./certification.routes");
const analyticsRoutes = require("./analytics.routes");

const router = express.Router();

router.use("/profiles", profileRoutes);
router.use("/skills", skillRoutes);
router.use("/social-links", socialLinkRoutes);
router.use("/projects", projectRoutes);
router.use("/experience", experienceRoutes);
router.use("/education", educationRoutes);
router.use("/certifications", certificationRoutes);
router.use("/analytics", analyticsRoutes);

module.exports = router;