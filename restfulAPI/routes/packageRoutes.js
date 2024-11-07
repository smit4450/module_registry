// Import dependencies using ES module syntax
import express from "express";
import fileUpload from "express-fileupload";
import multer from "multer";
import { createPackage, getPackageById, updatePackage } from "../models/packageModel.js";
import { protect } from "../middleware/authMiddleware.js";  // Note the .js extension for ES modules
import path from "path";

// Create an Express router instance
const router = express.Router();

// Configure Multer for file uploads, specifying the destination directory
const upload = multer({ dest: "uploads/" });

// Route for uploading a package (protected)
//router.post("/upload", protect, upload.single("file"), async (req, res) => {
router.post("/upload", fileUpload({useTempFiles: true}), async (req, res) => {
  const { name, version } = req.body;
  console.log(req.files.file.tempFilePath);
  // Check if a file was uploaded
  if (!req.files) return res.status(400).json({ message: "No file uploaded" });

  try {
    // Create a new package in the database
    const newPackage = await createPackage(name, version, req.files.file.tempFilePath);
    // Respond with the newly created package data
    res.status(201).json(newPackage);
  } catch (error) {
    // Handle any errors that occur during package creation
    res.status(500).json({ message: "Error creating package", error });
  }
});

// Route for retrieving a package by ID
router.get("/:id", async (req, res) => {
  try {
    // Retrieve package information from the database
    const pkg = await getPackageById(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    // Download the file associated with the package
    console.log(pkg);
    res.download(pkg.filePath);
  } catch (error) {
    // Handle any errors that occur during package retrieval
    res.status(500).json({ message: "Error retrieving package", error });
  }
});

// Route for updating a package by ID (protected)
router.put("/:id", protect, upload.single("file"), async (req, res) => {
  const { version } = req.body;

  try {
    // Update the package information, including a new version or file
    const updatedPackage = await updatePackage(req.params.id, version, req.file ? req.file.path : undefined);
    // Respond with the updated package data
    res.status(200).json(updatedPackage);
  } catch (error) {
    // Handle any errors that occur during package updating
    res.status(500).json({ message: "Error updating package", error });
  }
});

// Export the router as the default export for ES module compatibility
export default router;
