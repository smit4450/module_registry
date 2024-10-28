// routes/packageRoutes.js
const express = require("express");
const multer = require("multer");
const { createPackage, getPackageById, updatePackage } = require("../models/packageModel");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload a package
router.post("/", protect, upload.single("file"), async (req, res) => {
  const { name, version } = req.body;

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const newPackage = await createPackage(name, version, req.file.path);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: "Error creating package", error });
  }
});

// Get a package by ID
router.get("/:id", async (req, res) => {
  try {
    const pkg = await getPackageById(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.download(pkg.filePath);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving package", error });
  }
});

// Update a package
router.put("/:id", protect, upload.single("file"), async (req, res) => {
  const { version } = req.body;

  try {
    const updatedPackage = await updatePackage(req.params.id, version, req.file ? req.file.path : undefined);
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: "Error updating package", error });
  }
});

module.exports = router;
