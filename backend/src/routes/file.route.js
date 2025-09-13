const express = require("express");
const router = express.Router();
const {
  uploadFile,
  getUserFiles,
  deleteFile,
  previewFile,
  downloadFile,
  createFolder,
  shareFile,
  searchFiles,
} = require("../controllers/file.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// 📌 Upload file (optional folder in body)
router.post("/upload", protect, upload.single("file"), uploadFile);

// 📌 Get all user files (with pagination & optional folder filter)
router.get("/", protect, getUserFiles);

// 📌 Preview file
router.get("/preview/:id", protect, previewFile);

// 📌 Download file
router.get("/download/:id", protect, downloadFile);

// 📌 Delete file
router.delete("/:id", protect, deleteFile);

// 📌 Create folder
router.post("/folder", protect, express.json(), createFolder);

// 📌 Share file (generate public link)
router.post("/share/:id", protect, shareFile);

// 📌 Search / Filter files (query: name/folder)
router.get("/search", protect, searchFiles);

module.exports = router;
