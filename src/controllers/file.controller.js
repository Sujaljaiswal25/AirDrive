const fileModel = require("../models/file.model");
const { uploadFileToImageKit, deleteFileFromImageKit } = require("../services/storage.service");

// 📌 Upload file
const uploadFile = async (req, res) => {

//   console.log("REQ.FILE =>", req.file);
// console.log("REQ.BODY =>", req.body);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, mimetype, size, buffer } = req.file;

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
      fileId: result.fileId, // must for delete later
      owner: req.user._id,
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

// 📌 Get all files of logged-in user
const getUserFiles = async (req, res) => {
  try {
    const files = await fileModel
      .find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    return res.json(files);
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

    // 1️⃣ DB se file find kar
    const file = await fileModel.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // 2️⃣ Ownership check
    if (file.owner.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 3️⃣ ImageKit se delete
    if (file.fileId) {
      await deleteFileFromImageKit(file.fileId);
    }

    // 4️⃣ DB se delete
    await fileModel.findByIdAndDelete(fileId);

    return res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadFile, getUserFiles, deleteFile };
