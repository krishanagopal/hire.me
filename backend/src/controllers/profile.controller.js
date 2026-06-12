const User = require("../models/User");
const Profile = require("../models/Profile");
const SocialLink = require("../models/SocialLink");
const Skill = require("../models/Skill");
const Project = require("../models/Project");
const Experience = require("../models/Experience");
const Education = require("../models/Education");
const Certification = require("../models/Certification");

const RESERVED_USERNAMES = [
  "auth", "login", "register", "dashboard", "onboarding", "api", "admin",
  "profiles", "skills", "projects", "experience", "education", "certifications",
  "analytics", "social-links", "username", "me", "public"
];

// Check username availability
const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ success: false, message: "Username query parameter is required" });
    }

    const cleanUsername = username.trim().toLowerCase();
    
    // Check validation rules
    if (cleanUsername.length < 3) {
      return res.status(200).json({ success: true, available: false, message: "Username too short" });
    }

    if (RESERVED_USERNAMES.includes(cleanUsername)) {
      return res.status(200).json({ success: true, available: false, message: "Reserved route name" });
    }

    // Check database
    const existingUser = await User.findOne({ username: cleanUsername });
    return res.status(200).json({
      success: true,
      available: !existingUser,
    });
  } catch (error) {
    console.error("Check Username Error:", error);
    return res.status(500).json({ success: false, message: "Failed to check username availability", error: error.message });
  }
};

// Claim username
const claimUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const cleanUsername = username.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
    }

    if (RESERVED_USERNAMES.includes(cleanUsername)) {
      return res.status(400).json({ success: false, message: "Username is a reserved system route" });
    }

    // Check if taken by someone else
    const existingUser = await User.findOne({ username: cleanUsername });
    if (existingUser && String(existingUser._id) !== req.user.id) {
      return res.status(400).json({ success: false, message: "Username is already claimed" });
    }

    // Get current user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Set username on user document
    user.username = cleanUsername;
    await user.save();

    // Find or create blank Profile linked to this User
    let profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      profile = new Profile({
        user: user._id,
        fullName: user.email.split("@")[0],
        email: user.email,
        username: cleanUsername,
      });
      await profile.save();

      // Create a matching blank SocialLink doc
      const socialLink = new SocialLink({
        profile: profile._id,
      });
      await socialLink.save();
    } else {
      profile.username = cleanUsername;
      await profile.save();
    }

    return res.status(200).json({
      success: true,
      message: "Username successfully claimed",
      username: cleanUsername,
    });
  } catch (error) {
    console.error("Claim Username Error:", error);
    return res.status(500).json({ success: false, message: "Failed to claim username", error: error.message });
  }
};

// Get current user's profile with all nested details populated
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found. Please claim a username first." });
    }

    // Fetch related items separately
    const socialLinks = await SocialLink.findOne({ profile: profile._id }) || {};
    const skills = await Skill.find({ profile: profile._id });
    const projects = await Project.find({ profile: profile._id });
    const experiences = await Experience.find({ profile: profile._id });
    const educations = await Education.find({ profile: profile._id });
    const certifications = await Certification.find({ profile: profile._id });

    // Combine into response payload
    const profileObj = profile.toObject();
    profileObj.name = profile.fullName; // frontend compatibility mapping
    profileObj.username = user ? user.username : "";
    profileObj.socialLinks = socialLinks;
    profileObj.skills = skills;
    profileObj.projects = projects;
    profileObj.experiences = experiences;
    profileObj.educations = educations;
    profileObj.certifications = certifications;

    return res.status(200).json(profileObj);
  } catch (error) {
    console.error("Get My Profile Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch profile details", error: error.message });
  }
};

// Update profile and optionally sync associated lists (Skills, Projects, etc.)
const updateMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found. Please claim a username first." });
    }

    const {
      fullName,
      role,
      headline,
      bio,
      location,
      email,
      phone,
      availabilityStatus,
      avatarUrl,
      bannerUrl,
      resumeUrl,
      resumeFileName,
      socialLinks,
      skills,
      projects,
      experiences,
      educations,
      certifications,
    } = req.body;

    // Update Profile Fields
    const finalFullName = fullName || req.body.name;
    if (finalFullName) profile.fullName = finalFullName;
    if (role !== undefined) profile.role = role;
    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (email) profile.email = email;
    if (phone !== undefined) profile.phone = phone;
    if (availabilityStatus !== undefined) profile.availabilityStatus = availabilityStatus;
    if (avatarUrl !== undefined) profile.avatarUrl = avatarUrl;
    if (bannerUrl !== undefined) profile.bannerUrl = bannerUrl;
    if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
    if (resumeFileName !== undefined) profile.resumeFileName = resumeFileName;

    await profile.save();

    // 1. Sync Social Links if supplied
    if (socialLinks) {
      await SocialLink.findOneAndUpdate(
        { profile: profile._id },
        { ...socialLinks, profile: profile._id },
        { upsert: true, new: true }
      );
    }

    // 2. Sync Skills if supplied
    if (skills && Array.isArray(skills)) {
      await Skill.deleteMany({ profile: profile._id });
      if (skills.length > 0) {
        const skillsToInsert = skills.map(s => ({
          profile: profile._id,
          name: s.name,
          category: s.category,
        }));
        await Skill.insertMany(skillsToInsert);
      }
    }

    // 3. Sync Projects if supplied
    if (projects && Array.isArray(projects)) {
      await Project.deleteMany({ profile: profile._id });
      if (projects.length > 0) {
        const projectsToInsert = projects.map(p => ({
          profile: profile._id,
          name: p.name,
          description: p.description,
          techStack: p.techStack,
          githubUrl: p.githubUrl,
          liveUrl: p.liveUrl,
          demoVideoUrl: p.demoVideoUrl,
          thumbnailUrl: p.thumbnailUrl,
          isFeatured: p.isFeatured || false,
        }));
        await Project.insertMany(projectsToInsert);
      }
    }

    // 4. Sync Experiences if supplied
    if (experiences && Array.isArray(experiences)) {
      await Experience.deleteMany({ profile: profile._id });
      if (experiences.length > 0) {
        const expToInsert = experiences.map(e => ({
          profile: profile._id,
          title: e.title,
          company: e.company,
          location: e.location,
          startDate: e.startDate,
          endDate: e.endDate,
          current: e.current || false,
          description: e.description,
        }));
        await Experience.insertMany(expToInsert);
      }
    }

    // 5. Sync Educations if supplied
    if (educations && Array.isArray(educations)) {
      await Education.deleteMany({ profile: profile._id });
      if (educations.length > 0) {
        const eduToInsert = educations.map(ed => ({
          profile: profile._id,
          school: ed.school,
          degree: ed.degree,
          fieldOfStudy: ed.fieldOfStudy,
          startDate: ed.startDate,
          endDate: ed.endDate,
          description: ed.description,
        }));
        await Education.insertMany(eduToInsert);
      }
    }

    // 6. Sync Certifications if supplied
    if (certifications && Array.isArray(certifications)) {
      await Certification.deleteMany({ profile: profile._id });
      if (certifications.length > 0) {
        const certToInsert = certifications.map(c => ({
          profile: profile._id,
          name: c.name,
          issuer: c.issuer,
          issueDate: c.issueDate,
          credentialUrl: c.credentialUrl,
        }));
        await Certification.insertMany(certToInsert);
      }
    }

    // Mark onboarding Completed on User Document
    const user = await User.findByIdAndUpdate(req.user.id, { onboardingCompleted: true }, { new: true });

    // Fetch updated complete profile layout
    const updatedSocialLinks = await SocialLink.findOne({ profile: profile._id }) || {};
    const updatedSkills = await Skill.find({ profile: profile._id });
    const updatedProjects = await Project.find({ profile: profile._id });
    const updatedExperiences = await Experience.find({ profile: profile._id });
    const updatedEducations = await Education.find({ profile: profile._id });
    const updatedCertifications = await Certification.find({ profile: profile._id });

    const completeProfile = profile.toObject();
    completeProfile.name = profile.fullName; // frontend compatibility mapping
    completeProfile.username = user ? user.username : "";
    completeProfile.socialLinks = updatedSocialLinks;
    completeProfile.skills = updatedSkills;
    completeProfile.projects = updatedProjects;
    completeProfile.experiences = updatedExperiences;
    completeProfile.educations = updatedEducations;
    completeProfile.certifications = updatedCertifications;

    return res.status(200).json({
      success: true,
      profile: completeProfile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
  }
};

// GET Public profile card (by username)
const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const cleanUsername = username.trim().toLowerCase();

    const user = await User.findOne({ username: cleanUsername });
    if (!user) {
      return res.status(404).json({ success: false, message: "Profile card not found" });
    }

    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile card not found" });
    }

    // Fetch all populated references
    const socialLinks = await SocialLink.findOne({ profile: profile._id }) || {};
    const skills = await Skill.find({ profile: profile._id });
    const projects = await Project.find({ profile: profile._id });
    const experiences = await Experience.find({ profile: profile._id });
    const educations = await Education.find({ profile: profile._id });
    const certifications = await Certification.find({ profile: profile._id });

    const profileObj = profile.toObject();
    profileObj.name = profile.fullName; // frontend compatibility mapping
    profileObj.username = user.username;
    profileObj.socialLinks = socialLinks;
    profileObj.skills = skills;
    profileObj.projects = projects;
    profileObj.experiences = experiences;
    profileObj.educations = educations;
    profileObj.certifications = certifications;

    return res.status(200).json(profileObj);
  } catch (error) {
    console.error("Get Public Profile Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch public profile", error: error.message });
  }
};

module.exports = {
  checkUsername,
  claimUsername,
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
};
