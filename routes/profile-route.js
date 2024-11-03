const express = require("express");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getProfile,
  editProfile,
} = require("../controllers/profile-controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "userID-assets");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname); //buat generate unique file name
    cb(null, uniqueName);
  },
});

//filter file type
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image and pdf files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, //limit 10MB
});

route.get("/", getProfile);
route.put("/:id", editProfile);

module.exports = route;
