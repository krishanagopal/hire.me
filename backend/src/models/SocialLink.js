const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      unique: true,
    },
    github: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    portfolio: {
      type: String,
      default: "",
    },
    leetcode: {
      type: String,
      default: "",
    },
    codeforces: {
      type: String,
      default: "",
    },
    medium: {
      type: String,
      default: "",
    },
    hashnode: {
      type: String,
      default: "",
    },
    productHunt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SocialLink", socialLinkSchema);
