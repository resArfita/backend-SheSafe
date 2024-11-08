const User = require("../models/User");
const { v2: cloudinary } = require("cloudinary");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.json({
        message: "Berhasil mendapatkan data User",
        data: {
          fullName: user.fullName,
          email: user.email,
          gender: user.gender,
          birthDate: user.birthDate,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error(error); // Untuk debugging
      res.status(500).json({ message: "Terjadi kesalahan pada server", error });
    }
  },

  editProfile: async (req, res) => {
    const { id } = req.params;
    const editData = {
      ...req.body,
      edited: new Date(), //auto set edit date
    };

    let fileUrl = "";

    if (req.file) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
          use_filename: true,
          unique_filename: false,
        });
        // Ambil URL gambar yang telah di-upload
        fileUrl = uploadResponse.secure_url;
        editData.avatar = fileUrl; // Set avatar di editData
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return res.status(500).json({
          message: "Failed to upload image to Cloudinary",
          error: error.message,
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { ...editData },
      {
        new: true,
      }
    );
    res.json({
      message: "Berhasil mengupdate user",
      data: {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        gender: updatedUser.gender,
        birthDate: updatedUser.birthDate,
        avatar: updatedUser.avatar,
      },
    });
  },
};
