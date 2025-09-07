
const { uploadFile } = require("../services/storage.service");

const uploadController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const result = await uploadFile(req.file.buffer, req.file.originalname);

    res.status(200).json({ message: "File uploaded successfully", url: result.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadController };
