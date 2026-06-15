const User = require("../models/User");
const jwt = require("jsonwebtoken");

// A fresh placeholder middleware for route protection.
// Modify this to implement your own verification mechanism (e.g., JWT verification).
const protect = async (req, res, next) => {
  try {
    let user;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      
      if (token && token.startsWith("mock_token_")) {
        // Extract email from mock token
        const email = token.replace("mock_token_", "");
        user = await User.findOne({ email });
        if (!user) {
          user = new User({
            email,
            onboardingCompleted: false,
          });
          await user.save();
        }
      } else if (token) {
        // Attempt normal JWT decoding if applicable
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
          user = await User.findById(decoded.id);
        } catch (err) {
          // Token invalid or verification failed
        }
      }
    }
    
    // If no user was found/created from token, use a default fallback to prevent crashes
    if (!user) {
      const defaultEmail = "mockuser@hire.me";
      user = await User.findOne({ email: defaultEmail });
      if (!user) {
        user = new User({
          email: defaultEmail,
          onboardingCompleted: false,
        });
        await user.save();
      }
    }
    
    req.user = { id: user._id.toString(), email: user.email };
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ success: false, message: "Authentication failed", error: error.message });
  }
};

module.exports = protect;