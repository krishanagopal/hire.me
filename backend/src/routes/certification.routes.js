const express = require("express");
const {
  addCertification,
  getMyCertifications,
  updateCertification,
  deleteCertification,
} = require("../controllers/certification.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/", addCertification);
router.get("/", getMyCertifications);
router.put("/:id", updateCertification);
router.delete("/:id", deleteCertification);

module.exports = router;
