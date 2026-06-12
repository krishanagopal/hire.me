const Profile = require("../models/Profile");
const SocialLink = require("../models/SocialLink");

// Get social links
const getMySocialLinks = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    let socialLinks = await SocialLink.findOne({ profile: profile._id });
    if (!socialLinks) {
      // Return a blank template
      socialLinks = new SocialLink({ profile: profile._id });
      await socialLinks.save();
    }

    return res.status(200).json(socialLinks);
  } catch (error) {
    console.error("Get Social Links Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch social links", error: error.message });
  }
};

// Create or update social links
const updateMySocialLinks = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const socialLinks = await SocialLink.findOneAndUpdate(
      { profile: profile._id },
      { ...req.body, profile: profile._id },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, socialLinks });
  } catch (error) {
    console.error("Update Social Links Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update social links", error: error.message });
  }
};

module.exports = {
  getMySocialLinks,
  updateMySocialLinks,
};
