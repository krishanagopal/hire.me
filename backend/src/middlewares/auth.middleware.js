const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const supabaseUrl = process.env.SUPABASE_URL || "https://placeholder.supabase.co";

    // Verify token by fetching user profile from Supabase Auth API
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.SUPABASE_KEY
      }
    });

    if (!response.ok) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userData = await response.json();
    
    // Find or create user in our DB
    const User = require("../models/User");
    let mongoUser = await User.findOne({ supabaseId: userData.id });
    if (!mongoUser) {
      mongoUser = new User({
        supabaseId: userData.id,
        email: userData.email,
        authProvider: "email"
      });
      await mongoUser.save();
    }

    // Attach to request
    req.user = { 
      id: mongoUser._id.toString(),
      supabaseId: userData.id, 
      email: userData.email 
    };
    
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ success: false, message: "Authentication failed", error: error.message });
  }
};

module.exports = protect;