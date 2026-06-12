const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Otp = require("../models/Otp");
const Profile = require("../models/Profile");


// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "hireme_super_secret_2026",
    { expiresIn: "30d" }
  );
};

// Google ID token verification
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    let email, name, googleId, avatar;

    // Check for developer fallback mode (mock google tokens)
    if (!process.env.GOOGLE_CLIENT_ID || token.startsWith("mock_google_")) {
      console.log("[Auth Controller] Using simulated Google OAuth verification");
      email = "google_user@example.com";
      name = "Google Dev User";
      googleId = "mock_google_sub_123456";
      avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150";

      if (token.startsWith("mock_google_")) {
        const parts = token.split("::");
        if (parts.length >= 3) {
          email = parts[1];
          name = parts[2];
          googleId = "google_" + email.replace(/[^a-zA-Z0-9]/g, "");
          if (parts[3]) avatar = parts[3];
        }
      }
    } else {
      // Real Google verification
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      email = payload.email;
      name = payload.name;
      googleId = payload.sub;
      avatar = payload.picture;
    }

    if (!email) {
      return res.status(400).json({ success: false, message: "Google profile has no email" });
    }

    // Find or Create User
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      // If user exists, update their googleId and avatar if not already present
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        email: email.toLowerCase(),
        provider: "google",
        googleId,
        avatar,
        isVerified: true,
      });
      await user.save();
    }

    const jwtToken = generateToken(user);

    const profile = await Profile.findOne({ user: user._id });
    const nameResponse = profile ? profile.fullName : (name || user.email.split("@")[0]);

    return res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: nameResponse,
        username: user.username,
        provider: user.provider,
        avatar: user.avatar,
        isVerified: user.isVerified,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return res.status(500).json({ success: false, message: "Google Authentication failed", error: error.message });
  }
};

// GitHub code-to-profile exchange
const githubLogin = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Auth code is required" });
    }

    let email, name, githubId, avatar;

    // Check for developer fallback mode (mock github codes)
    if (!process.env.GITHUB_CLIENT_ID || code.startsWith("mock_github_")) {
      console.log("[Auth Controller] Using simulated GitHub OAuth verification");
      email = "github_user@example.com";
      name = "GitHub Dev User";
      githubId = "mock_github_id_123456";
      avatar = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150&h=150";

      if (code.startsWith("mock_github_")) {
        const parts = code.split("::");
        if (parts.length >= 3) {
          email = parts[1];
          name = parts[2];
          githubId = "github_" + email.replace(/[^a-zA-Z0-9]/g, "");
          if (parts[3]) avatar = parts[3];
        }
      }
    } else {
      // Real GitHub authentication
      const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      
      const tokenData = await response.json();
      if (!tokenData.access_token) {
        return res.status(400).json({ success: false, message: "Invalid GitHub OAuth code" });
      }
      
      // Fetch GitHub profile
      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "hire-me-app",
        },
      });
      const githubUser = await userRes.json();
      githubId = String(githubUser.id);
      name = githubUser.name || githubUser.login;
      avatar = githubUser.avatar_url;

      // Fetch emails to get the verified primary email
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "hire-me-app",
        },
      });
      const emails = await emailRes.json();
      if (Array.isArray(emails)) {
        const primaryObj = emails.find(e => e.primary && e.verified) || emails.find(e => e.primary) || emails[0];
        email = primaryObj ? primaryObj.email : null;
      }
    }

    if (!email) {
      return res.status(400).json({ success: false, message: "GitHub profile has no verified email" });
    }

    // Find or Create User
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      // Update fields if missing
      let updated = false;
      if (!user.githubId) {
        user.githubId = githubId;
        updated = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      // Create user
      user = new User({
        email: email.toLowerCase(),
        provider: "github",
        githubId,
        avatar,
        isVerified: true,
      });
      await user.save();
    }

    const jwtToken = generateToken(user);

    const profile = await Profile.findOne({ user: user._id });
    const nameResponse = profile ? profile.fullName : (name || user.email.split("@")[0]);

    return res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: nameResponse,
        username: user.username,
        provider: user.provider,
        avatar: user.avatar,
        isVerified: user.isVerified,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("GitHub OAuth Error:", error);
    return res.status(500).json({ success: false, message: "GitHub Authentication failed", error: error.message });
  }
};

// Request Email OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this email to avoid duplicate tokens
    await Otp.deleteMany({ email: email.toLowerCase() });

    // Save OTP to database (automatically expires in 5 minutes via TTL index)
    const otpDoc = new Otp({
      email: email.toLowerCase(),
      otp,
    });
    await otpDoc.save();

    console.log(`\n========================================\n[OTP SEND] Email: ${email}\n[OTP SEND] Code: ${otp}\n========================================\n`);

    // Check if SMTP environment variables are configured for sending real email
    if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT),
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Hire.me Auth" <${process.env.SMTP_USER}>`,
          to: email,
          subject: "Your Hire.me One-Time Verification Code",
          text: `Your Hire.me One-Time Code is: ${otp}. It will expire in 5 minutes.`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #3b82f6;">Hire.me Verification Code</h2>
              <p>Please use the following one-time password to authenticate your account:</p>
              <h1 style="background: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; letter-spacing: 5px; color: #1f2937;">${otp}</h1>
              <p style="color: #6b7280; font-size: 12px;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
            </div>
          `,
        });
        console.log(`[Auth Controller] Email OTP successfully sent to ${email}`);
      } catch (mailError) {
        console.error("[Auth Controller] Nodemailer failed to send email:", mailError.message);
        // We will still succeed because OTP is printed in the logs for dev convenience
      }
    }

    return res.status(200).json({
      success: true,
      message: "One-Time Password has been sent to your email. Please check your inbox (or console log in dev).",
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
};

// Verify OTP code
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP code are required" });
    }

    // Look up OTP record
    const otpRecord = await Otp.findOne({
      email: email.toLowerCase(),
      otp: otp.trim(),
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    // Delete the OTP since it is verified
    await Otp.deleteOne({ _id: otpRecord._id });

    // Find or create the user
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        provider: "email",
        isVerified: true,
      });
      await user.save();
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const jwtToken = generateToken(user);

    const profile = await Profile.findOne({ user: user._id });
    const nameResponse = profile ? profile.fullName : user.email.split("@")[0];

    return res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: nameResponse,
        username: user.username,
        provider: user.provider,
        avatar: user.avatar,
        isVerified: user.isVerified,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ success: false, message: "OTP Verification failed", error: error.message });
  }
};

// Get current user details
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const profile = await Profile.findOne({ user: user._id });
    const nameResponse = profile ? profile.fullName : user.email.split("@")[0];

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: nameResponse,
        username: user.username,
        provider: user.provider,
        avatar: user.avatar,
        isVerified: user.isVerified,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Get Me Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch user session", error: error.message });
  }
};

module.exports = {
  googleLogin,
  githubLogin,
  sendOtp,
  verifyOtp,
  getMe,
};