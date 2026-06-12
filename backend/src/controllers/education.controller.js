const Profile = require("../models/Profile");
const Education = require("../models/Education");

// Add education entry
const addEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { school, degree, fieldOfStudy, startDate, endDate, description } = req.body;
    if (!school || !degree || !fieldOfStudy || !startDate) {
      return res.status(400).json({ success: false, message: "School, degree, field of study, and start date are required" });
    }

    const newEducation = new Education({
      profile: profile._id,
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate: endDate || "",
      description: description || "",
    });
    await newEducation.save();

    return res.status(201).json({ success: true, education: newEducation });
  } catch (error) {
    console.error("Add Education Error:", error);
    return res.status(500).json({ success: false, message: "Failed to add education record", error: error.message });
  }
};

// Get education entries
const getMyEducations = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const educations = await Education.find({ profile: profile._id }).sort({ startDate: -1 });
    return res.status(200).json(educations);
  } catch (error) {
    console.error("Get Education Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch education records", error: error.message });
  }
};

// Update education entry
const updateEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { id } = req.params;
    const edu = await Education.findById(id);
    if (!edu) {
      return res.status(404).json({ success: false, message: "Education record not found" });
    }

    if (String(edu.profile) !== String(profile._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to update this record" });
    }

    const { school, degree, fieldOfStudy, startDate, endDate, description } = req.body;

    if (school) edu.school = school;
    if (degree) edu.degree = degree;
    if (fieldOfStudy) edu.fieldOfStudy = fieldOfStudy;
    if (startDate) edu.startDate = startDate;
    if (endDate !== undefined) edu.endDate = endDate;
    if (description !== undefined) edu.description = description;

    await edu.save();

    return res.status(200).json({ success: true, education: edu });
  } catch (error) {
    console.error("Update Education Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update education record", error: error.message });
  }
};

// Delete education entry
const deleteEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { id } = req.params;
    const edu = await Education.findById(id);
    if (!edu) {
      return res.status(404).json({ success: false, message: "Education record not found" });
    }

    if (String(edu.profile) !== String(profile._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this record" });
    }

    await Education.deleteOne({ _id: edu._id });

    return res.status(200).json({ success: true, message: "Education entry successfully removed" });
  } catch (error) {
    console.error("Delete Education Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete record", error: error.message });
  }
};

module.exports = {
  addEducation,
  getMyEducations,
  updateEducation,
  deleteEducation,
};
