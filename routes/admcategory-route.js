const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  addCategory,
  getAllCategory,
  editCategory,
  deleteCategoryById,
} = require("../controllers/category-controller");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpg|jpeg|png|JPG|PNG|JPEG|JPG/;
  const isValidExtension = allowedExtensions.test(file.mimetype);

  if (isValidExtension) {
    cb(null, true);
  } else {
    cb(new Error("Ekstensi file tidak diperbolehkan!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

const route = express.Router();

route.post("/", addCategory);
route.get("/", getAllCategory);
route.put("/", editCategory);
route.delete("/", deleteCategoryById);

module.exports = route;
