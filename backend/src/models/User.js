const mongoose = require("mongoose");

const userSchema =new mongoose.Schema(
   {
    username: {
      type: String,
      unique: true,
      sparse: true, // username will be chosen after first login
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    provider: {
      type: String,
      enum: ["google", "github"],
      required: true,
    },

    googleId: {
      type: String,
      default: null,
    },

    githubId: {
      type: String,
      default: null,
    },

    avatar: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: true, // OAuth providers already verify email
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }   
    
);

module.exports = mongoose.model("User", userSchema);