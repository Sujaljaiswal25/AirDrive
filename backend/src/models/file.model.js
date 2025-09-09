const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String, // image/png, application/pdf, etc.
      required: true,
    },
    size: {
      type: Number, // in bytes
      required: true,
    },
    url: {
      type: String, // ImageKit ka returned URL
      required: true,
    },
    fileId: {
      type: String, // 🔑 ImageKit ka unique fileId
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // file kis user ne upload ki
      required: true,
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // baad me sharing feature ke liye
      },
    ],
  },
  { timestamps: true }
);

const fileModel = mongoose.model("file", fileSchema);

module.exports = fileModel;
