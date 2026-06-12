const Profile = require("../models/Profile");
const Skill = require("../models/Skill");

// Add a skill
const addSkill = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found. Please claim a username first." });
    }

    const { name, category } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, message: "Name and category are required" });
    }

    const newSkill = new Skill({
      profile: profile._id,
      name,
      category,
    });
    await newSkill.save();

    return res.status(201).json({ success: true, skill: newSkill });
  } catch (error) {
    console.error("Add Skill Error:", error);
    return res.status(500).json({ success: false, message: "Failed to add skill", error: error.message });
  }
};

// Get my skills
const getMySkills = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const skills = await Skill.find({ profile: profile._id });
    return res.status(200).json(skills);
  } catch (error) {
    console.error("Get Skills Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch skills", error: error.message });
  }
};

// Update a skill
const updateSkill = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { id } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    if (String(skill.profile) !== String(profile._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to update this skill" });
    }

    const { name, category } = req.body;
    if (name) skill.name = name;
    if (category) skill.category = category;

    await skill.save();

    return res.status(200).json({ success: true, skill });
  } catch (error) {
    console.error("Update Skill Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update skill", error: error.message });
  }
};

// Delete a skill
const deleteSkill = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { id } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    if (String(skill.profile) !== String(profile._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this skill" });
    }

    await Skill.deleteOne({ _id: skill._id });

    return res.status(200).json({ success: true, message: "Skill successfully removed" });
  } catch (error) {
    console.error("Delete Skill Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete skill", error: error.message });
  }
};

module.exports = {
  addSkill,
  getMySkills,
  updateSkill,
  deleteSkill,
};
