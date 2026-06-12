const Profile = require("../models/Profile");
const AnalyticsEvent = require("../models/AnalyticsEvent");
const User = require("../models/User");

// Helper to determine device type from User Agent header
const getDeviceType = (userAgent) => {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|iemobile|kindle/i.test(ua)) return "mobile";
  return "desktop";
};

// Record a recruiter event
const recordEvent = async (req, res) => {
  try {
    const { username, eventType, eventMetadata } = req.body;
    if (!username || !eventType) {
      return res.status(400).json({ success: false, message: "Username and eventType are required" });
    }

    const cleanUsername = username.trim().toLowerCase();
    const user = await User.findOne({ username: cleanUsername });
    if (!user) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const userAgent = req.headers["user-agent"];
    const deviceType = getDeviceType(userAgent);

    const newEvent = new AnalyticsEvent({
      profile: profile._id,
      eventType,
      eventMetadata: eventMetadata || "",
      deviceType,
    });
    await newEvent.save();

    return res.status(201).json({ success: true, message: "Event successfully logged" });
  } catch (error) {
    console.error("Record Event Error:", error);
    return res.status(500).json({ success: false, message: "Failed to record event", error: error.message });
  }
};

// Get stats summary for user console
const getAnalyticsSummary = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const events = await AnalyticsEvent.find({ profile: profile._id });

    // Aggregate statistics
    const views = events.filter(e => e.eventType === "profile_view").length;
    const downloads = events.filter(e => e.eventType === "resume_download").length;
    
    // Total clicks are the sum of link clicks, social clicks, and video plays
    const clickTypes = ["github_click", "linkedin_click", "contact_click", "demo_video_play"];
    const clicks = events.filter(e => clickTypes.includes(e.eventType)).length;

    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    const clicksBreakdown = {};

    events.forEach(e => {
      // Count devices
      if (devices[e.deviceType] !== undefined) {
        devices[e.deviceType]++;
      } else {
        devices.desktop++;
      }

      // Count click events breakdown
      if (e.eventType !== "profile_view") {
        const label = e.eventType;
        clicksBreakdown[label] = (clicksBreakdown[label] || 0) + 1;
      }
    });

    return res.status(200).json({
      views,
      downloads,
      clicks,
      devices,
      clicksBreakdown,
    });
  } catch (error) {
    console.error("Get Analytics Summary Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch analytics summary", error: error.message });
  }
};

module.exports = {
  recordEvent,
  getAnalyticsSummary,
};
