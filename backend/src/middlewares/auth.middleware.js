const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "hireme_super_secret_2026"
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = protect;