const googleLogin = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Google login endpoint",
  });
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  googleLogin,
  getMe,
};