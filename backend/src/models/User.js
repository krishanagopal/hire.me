const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    supabaseId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
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