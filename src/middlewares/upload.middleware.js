// middleware/upload.middleware.js
const multer = require("multer");

const storage = multer.memoryStorage(); // memory me file rakhega (ImageKit ke liye)
const upload = multer({ storage });

module.exports = upload;
