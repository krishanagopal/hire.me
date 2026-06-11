const jwt = require("jsonwebtoken");
require("dotenv").config();

const token = jwt.sign(
  {
    userId: "123456",
    email: "test@test.com",
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

console.log(token);