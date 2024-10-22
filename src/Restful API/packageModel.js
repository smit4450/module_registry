// models/packageModel.js
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  version: { type: String, required: true },
  filePath: { type: String, required: true }, // Path to the uploaded file
  createdAt: { type: Date, default: Date.now },
  ratings: {
    versionPinning: { type: Number, default: 1.0 }, // Default 1.0 for no dependencies
    codeReviewFraction: { type: Number, default: 0.0 },
  },
});

module.exports = mongoose.model("Package", packageSchema);
