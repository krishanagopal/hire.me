const User = require("../models/User");

// Synchronizes a Supabase user with the MongoDB database
const syncUser = async (req, res) => {
  try {
    // req.user is populated by the auth.middleware.js after verifying the JWT
    const { supabaseId, email } = req.user;

    // Check if user already exists
    let user = await User.findOne({ supabaseId });

    if (!user) {
      // Create new user in MongoDB
      user = new User({
        supabaseId,
        email,
        authProvider: "email", // default to email, could be dynamic later
      });
      await user.save();
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        supabaseId: user.supabaseId,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Sync User Error:", error);
    return res.status(500).json({ success: false, message: "Failed to sync user", error: error.message });
  }
};

module.exports = {
  syncUser,
};
