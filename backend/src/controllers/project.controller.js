const Profile = require("../models/Profile");
const Project = require("../models/Project");
const FeaturedProject = require("../models/FeaturedProject");

// Add a project
const addProject = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found. Please claim a username first." });
    }

    const { name, description, techStack, githubUrl, liveUrl, demoVideoUrl, thumbnailUrl, isFeatured } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Name and description are required" });
    }

    // If isFeatured is true, unset other featured projects for this profile
    if (isFeatured) {
      await Project.updateMany(
        { profile: profile._id },
        { isFeatured: false }
      );
    }

    const newProject = new Project({
      profile: profile._id,
      name,
      description,
      techStack: techStack || [],
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      demoVideoUrl: demoVideoUrl || "",
      thumbnailUrl: thumbnailUrl || "",
      isFeatured: isFeatured || false,
    });
    await newProject.save();

    // Sync FeaturedProject collection if featured
    if (isFeatured) {
      await FeaturedProject.deleteMany({ profile: profile._id });
      const featured = new FeaturedProject({
        profile: profile._id,
        project: newProject._id,
        order: 0,
      });
      await featured.save();
    }

    return res.status(201).json({ success: true, project: newProject });
  } catch (error) {
    console.error("Add Project Error:", error);
    return res.status(500).json({ success: false, message: "Failed to add project", error: error.message });
  }
};

// Get my projects
const getMyProjects = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const projects = await Project.find({ profile: profile._id });
    return res.status(200).json(projects);
  } catch (error) {
    console.error("Get Projects Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch projects", error: error.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (String(project.profile) !== String(profile._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to update this project" });
    }

    const { name, description, techStack, githubUrl, liveUrl, demoVideoUrl, thumbnailUrl, isFeatured } = req.body;

    // If isFeatured is changing to true, unset others
    if (isFeatured && !project.isFeatured) {
      await Project.updateMany(
        { profile: profile._id },
        { isFeatured: false }
      );
      
      // Update FeaturedProject collection
      await FeaturedProject.deleteMany({ profile: profile._id });
      const featured = new FeaturedProject({
        profile: profile._id,
        project: project._id,
        order: 0,
      });
      await featured.save();
    } else if (isFeatured === false && project.isFeatured) {
      // If unfeaturing, clear from FeaturedProject collection
      await FeaturedProject.deleteMany({ profile: profile._id, project: project._id });
    }

    if (name) project.name = name;
    if (description) project.description = description;
    if (techStack) project.techStack = techStack;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (demoVideoUrl !== undefined) project.demoVideoUrl = demoVideoUrl;
    if (thumbnailUrl !== undefined) project.thumbnailUrl = thumbnailUrl;
    if (isFeatured !== undefined) project.isFeatured = isFeatured;

    await project.save();

    return res.status(200).json({ success: true, project });
  } catch (error) {
    console.error("Update Project Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update project", error: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (String(project.profile) !== String(profile._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this project" });
    }

    // Clear from FeaturedProject if it was featured
    if (project.isFeatured) {
      await FeaturedProject.deleteMany({ profile: profile._id, project: project._id });
    }

    await Project.deleteOne({ _id: project._id });

    return res.status(200).json({ success: true, message: "Project successfully removed" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete project", error: error.message });
  }
};

// Mark a project as featured (and unset others)
const featureProject = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (String(project.profile) !== String(profile._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to modify this project" });
    }

    // Unset all other projects
    await Project.updateMany(
      { profile: profile._id, _id: { $ne: project._id } },
      { isFeatured: false }
    );

    project.isFeatured = true;
    await project.save();

    // Set FeaturedProject
    await FeaturedProject.deleteMany({ profile: profile._id });
    const featured = new FeaturedProject({
      profile: profile._id,
      project: project._id,
      order: 0,
    });
    await featured.save();

    return res.status(200).json({ success: true, message: "Project marked as featured", project });
  } catch (error) {
    console.error("Feature Project Error:", error);
    return res.status(500).json({ success: false, message: "Failed to feature project", error: error.message });
  }
};

module.exports = {
  addProject,
  getMyProjects,
  updateProject,
  deleteProject,
  featureProject,
};
