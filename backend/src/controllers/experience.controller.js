const Profile = require("../models/Profile");
const Experience = require("../models/Experience");

// Add work experience
const addExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { title, company, location, startDate, endDate, current, description } = req.body;
    if (!title || !company || !startDate) {
      return res.status(400).json({ success: false, message: "Title, company, and start date are required" });
    }

    const newExperience = new Experience({
      profile: profile._id,
      title,
      company,
      location: location || "",
      startDate,
      endDate: endDate || "Present",
      current: current || false,
      description: description || "",
    });
    await newExperience.save();

    return res.status(201).json({ success: true, experience: newExperience });
  } catch (error) {
    console.error("Add Experience Error:", error);
    return res.status(500).json({ success: false, message: "Failed to add work experience", error: error.message });
  }
};

// Get work experiences
const getMyExperiences = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const experiences = await Experience.find({ profile: profile._id }).sort({ startDate: -1 });
    return res.status(200).json(experiences);
  } catch (error) {
    console.error("Get Experiences Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch work experiences", error: error.message });
  }
};

// Update work experience
const updateExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { id } = req.params;
    const exp = await Experience.findById(id);
    if (!exp) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    if (String(exp.profile) !== String(profile._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to update this entry" });
    }

    const { title, company, location, startDate, endDate, current, description } = req.body;

    if (title) exp.title = title;
    if (company) exp.company = company;
    if (location !== undefined) exp.location = location;
    if (startDate) exp.startDate = startDate;
    if (endDate !== undefined) exp.endDate = endDate;
    if (current !== undefined) exp.current = current;
    if (description !== undefined) exp.description = description;

    await exp.save();

    return res.status(200).json({ success: true, experience: exp });
  } catch (error) {
    console.error("Update Experience Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update work experience", error: error.message });
  }
};

// Delete work experience
const deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { id } = req.params;
    const exp = await Experience.findById(id);
    if (!exp) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    if (String(exp.profile) !== String(profile._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this entry" });
    }

    await Experience.deleteOne({ _id: exp._id });

    return res.status(200).json({ success: true, message: "Work experience entry successfully removed" });
  } catch (error) {
    console.error("Delete Experience Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete entry", error: error.message });
  }
};

module.exports = {
  addExperience,
  getMyExperiences,
  updateExperience,
  deleteExperience,
};
