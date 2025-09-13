const userModel = require("../models/user.model");
const { uploadFileToImageKit } = require("../services/storage.service");

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updates = { name };

    if (req.file) {
      const result = await uploadFileToImageKit(
        req.file.buffer,
        "avatar-" + req.user._id
      );
      updates.avatar = result.url;
    }

    const user = await userModel
      .findByIdAndUpdate(req.user._id, updates, { new: true })
      .select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
