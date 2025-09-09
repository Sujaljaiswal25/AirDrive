const fileModel = require("../models/file.model");
const { uploadFileToImageKit, deleteFileFromImageKit } = require("../services/storage.service");
const crypto = require("crypto");

// 📌 Upload file (with folder support)
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const { folder } = req.body || { folder: "root" }; // default folder = root

    // ✅ Upload to ImageKit
    const result = await uploadFileToImageKit(buffer, originalname);

    if (!result || !result.fileId) {
      return res.status(500).json({ message: "ImageKit upload failed, fileId missing" });
    }

    // ✅ Save in MongoDB
    const file = await fileModel.create({
      name: originalname,
      type: mimetype,
      size,
      url: result.url,
      fileId: result.fileId,
      owner: req.user._id,
      folder,
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      file,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// 📌 Get all files of logged-in user (with pagination + folder filter)
const getUserFiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", folder } = req.query;

    let filter = { owner: req.user._id };
    if (folder) filter.folder = folder;

    const files = await fileModel
      .find(filter)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalFiles = await fileModel.countDocuments(filter);

    return res.json({
      success: true,
      count: files.length,
      totalFiles,
      currentPage: Number(page),
      totalPages: Math.ceil(totalFiles / limit),
      files,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch files", error: error.message });
  }
};

// 📌 Delete file (ImageKit + MongoDB)
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user._id;

    const file = await fileModel.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (file.fileId) {
      await deleteFileFromImageKit(file.fileId);
    }

    await fileModel.findByIdAndDelete(fileId);

    return res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Preview file (return URL)
const previewFile = async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.json({
      message: "File preview fetched",
      file,
    });
  } catch (error) {
    console.error("Preview error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Download file (redirect to ImageKit URL)
const downloadFile = async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.redirect(file.url);
  } catch (error) {
    console.error("Download error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Create Folder
const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    if (!folderName) return res.status(400).json({ message: "Folder name required" });

    const exists = await fileModel.findOne({ owner: req.user._id, folder: folderName });
    if (exists) return res.status(400).json({ message: "Folder already exists" });

    return res.json({ message: "Folder created successfully", folder: folderName });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Share File
const shareFile = async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    file.shared = true;
    file.sharedLink = `${process.env.FRONTEND_URL}/shared/${file._id}`;
    await file.save();

    return res.json({ message: "File shared successfully", sharedLink: file.sharedLink });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Search / Filter Files
const searchFiles = async (req, res) => {
  try {
    const { query, folder } = req.query;
    let filter = { owner: req.user._id };

    if (folder) filter.folder = folder;
    if (query) filter.name = { $regex: query, $options: "i" };

    const files = await fileModel.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, count: files.length, files });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadFile,
  getUserFiles,
  deleteFile,
  previewFile,
  downloadFile,
  createFolder,
  shareFile,
  searchFiles
};
