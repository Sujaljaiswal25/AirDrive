const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      index: true, // Add index for faster queries
    },
    size: {
      type: Number,
      required: true,
    },

    // Storage Info
    url: {
      type: String,
      required: true,
    },
    fileId: {
      type: String,
      required: true,
      index: true,
    },

    // Ownership & Sharing
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    folder: {
      type: String,
      default: "root",
      index: true,
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    shareId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    isShared: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    // Add virtual fields if needed
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add compound indexes for common queries
fileSchema.index({ owner: 1, type: 1 });
fileSchema.index({ owner: 1, folder: 1 });

const fileModel = mongoose.model("file", fileSchema);
module.exports = fileModel;
