const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "Professional",
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    availabilityStatus: {
      type: String,
      enum: ["Open To Work", "Actively Interviewing", "Freelancing", "Not Looking"],
      default: "Open To Work",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    bannerUrl: {
      type: String,
      default: "",
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    resumeFileName: {
      type: String,
      default: "",
    },
    tier: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);
