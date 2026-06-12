const mongoose = require("mongoose");

const analyticsEventSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        "profile_view",
        "resume_download",
        "github_click",
        "linkedin_click",
        "demo_video_play",
        "contact_click"
      ],
      required: true,
    },
    eventMetadata: {
      type: String,
      default: "",
    },
    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
      default: "desktop",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AnalyticsEvent", analyticsEventSchema);
