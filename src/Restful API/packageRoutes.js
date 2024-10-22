// routes/packageRoutes.js
const express = require("express");
const multer = require("multer");
const Package = require("../models/packageModel");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

/**
 * @swagger
 * /packages:
 *   post:
 *     summary: Upload a new package
 *     description: Upload a new package as a zipped file.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The package file to upload.
 *     responses:
 *       201:
 *         description: Package uploaded successfully.
 */
router.post("/", protect, upload.single("file"), async (req, res) => {
  const { name, version } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const newPackage = new Package({
    name,
    version,
    filePath: req.file.path,
  });

  try {
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(500).json({ message: "Error saving package", error });
  }
});

/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Download a package
 *     description: Download a package by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the package to download.
 *     responses:
 *       200:
 *         description: Package downloaded successfully.
 *       404:
 *         description: Package not found.
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pkg = await Package.findById(id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    res.download(pkg.filePath);
  } catch (error) {
    res.status(500).json({ message: "Error downloading package", error });
  }
});

/**
 * @swagger
 * /packages/{id}:
 *   put:
 *     summary: Update a package
 *     description: Update a package version and upload a new file.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the package to update.
 *     responses:
 *       200:
 *         description: Package updated successfully.
 *       404:
 *         description: Package not found.
 */
router.put("/:id", protect, upload.single("file"), async (req, res) => {
  const { id } = req.params;

  try {
    const pkg = await Package.findById(id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    // Update package details
    pkg.version = req.body.version || pkg.version;
    if (req.file) pkg.filePath = req.file.path;

    const updatedPackage = await pkg.save();
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: "Error updating package", error });
  }
});

module.exports = router;
