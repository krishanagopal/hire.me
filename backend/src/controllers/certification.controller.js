const Profile = require("../models/Profile");
const Certification = require("../models/Certification");

// Add certification
const addCertification = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { name, issuer, issueDate, credentialUrl } = req.body;
    if (!name || !issuer || !issueDate) {
      return res.status(400).json({ success: false, message: "Name, issuer, and issue date are required" });
    }

    const newCertification = new Certification({
      profile: profile._id,
      name,
      issuer,
      issueDate,
      credentialUrl: credentialUrl || "",
    });
    await newCertification.save();

    return res.status(201).json({ success: true, certification: newCertification });
  } catch (error) {
    console.error("Add Certification Error:", error);
    return res.status(500).json({ success: false, message: "Failed to add certification", error: error.message });
  }
};

// Get certifications
const getMyCertifications = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const certifications = await Certification.find({ profile: profile._id }).sort({ issueDate: -1 });
    return res.status(200).json(certifications);
  } catch (error) {
    console.error("Get Certifications Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch certifications", error: error.message });
  }
};

// Update certification
const updateCertification = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { id } = req.params;
    const cert = await Certification.findById(id);
    if (!cert) {
      return res.status(404).json({ success: false, message: "Certification not found" });
    }

    if (String(cert.profile) !== String(profile._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to update this entry" });
    }

    const { name, issuer, issueDate, credentialUrl } = req.body;

    if (name) cert.name = name;
    if (issuer) cert.issuer = issuer;
    if (issueDate) cert.issueDate = issueDate;
    if (credentialUrl !== undefined) cert.credentialUrl = credentialUrl;

    await cert.save();

    return res.status(200).json({ success: true, certification: cert });
  } catch (error) {
    console.error("Update Certification Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update certification", error: error.message });
  }
};

// Delete certification
const deleteCertification = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { id } = req.params;
    const cert = await Certification.findById(id);
    if (!cert) {
      return res.status(404).json({ success: false, message: "Certification not found" });
    }

    if (String(cert.profile) !== String(profile._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this entry" });
    }

    await Certification.deleteOne({ _id: cert._id });

    return res.status(200).json({ success: true, message: "Certification entry successfully removed" });
  } catch (error) {
    console.error("Delete Certification Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete entry", error: error.message });
  }
};

module.exports = {
  addCertification,
  getMyCertifications,
  updateCertification,
  deleteCertification,
};
