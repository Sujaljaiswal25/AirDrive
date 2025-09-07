// routes/file.route.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { uploadController } = require("../controllers/file.controller");

// Auth middleware can be added here to protect route
router.post("/upload", upload.single("file"), uploadController);

module.exports = router;
