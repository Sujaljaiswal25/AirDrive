const express = require("express");
const router = express.Router();
const { uploadFile, getUserFiles, deleteFile } = require("../controllers/file.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, getUserFiles);
router.delete("/:id", protect, deleteFile);

module.exports = router;
