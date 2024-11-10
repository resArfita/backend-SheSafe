require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const { regist, login, logout } = require("../controllers/auth-controller");
const streamifier = require("streamifier");
const { v2: cloudinary } = require("cloudinary");

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Konfigurasi Multer untuk menyimpan file dalam buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Batas ukuran file 2MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpg|jpeg|png/;
    const extname = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedExtensions.test(file.mimetype);
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Fungsi untuk mengunggah file ke Cloudinary menggunakan stream dan mengembalikan Promise
async function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const timestamp = Math.floor(Date.now() / 1000); // Timestamp saat ini
    const uploadOptions = {
      folder: "identitasUser",
      timestamp,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Error uploading file to Cloudinary:", error);
          return reject(error); // Reject jika terjadi error
        }
        resolve(result); // Resolve jika berhasil
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream); // Upload file ke Cloudinary
  });
}

// Route untuk register dengan file upload
const route = express.Router();
route.post(
  "/register",
  upload.single("fileIdentity"),
  async (req, res, next) => {
    try {
      // Pastikan file ada sebelum mencoba mengupload
      if (!req.file) {
        return res.status(400).json({ message: "File identity is required." });
      }

      const result = await uploadToCloudinary(req.file.buffer); // Upload file ke Cloudinary
      req.body.fileUrl = result.secure_url; // Dapatkan URL file setelah upload selesai
      await regist(req, res); // Lanjutkan dengan registrasi pengguna
    } catch (error) {
      next(error); // Mengarahkan ke handler error middleware
    }
  }
);

route.post("/login", login);
route.post("/logout", logout);

module.exports = route;
