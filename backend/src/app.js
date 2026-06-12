const express = require("express");
const cors = require("cors");
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for the frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Configure JSON body parser with increased limit for Base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const routes = require("./routes");

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "hire.me api running",
  });
});

module.exports = app;