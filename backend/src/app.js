require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import routes
const authRoute = require("./routes/auth.route");
const fileRoutes = require("./routes/file.route");
const profileRoutes = require("./routes/profile.route");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Global Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/files", fileRoutes);
app.use("/api/profile", profileRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
