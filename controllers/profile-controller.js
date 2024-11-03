const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    const { userId } = req.user;
    const data = await User.find({ _id: userId });

    res.json({
      message: "Berhasil mendapatkan semua User",
      data: {
        ...data,
        fullName,
        email,
        gender,
        birthDate,
        avatar,
      },
    });
  },

  editProfile: async (req, res) => {
    const editData = {
      ...req.body,
      edited: new Date(), //auto set edit date
    };

    if (req.file) {
      console.log("File uploaded: ", req.file);
      editData.file = `/userID-assets/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(id, editData, {
      new: true,
    });
    res.json({
      message: "Berhasil mengupdate user",
      data: {
        ...updatedUser,
        fullName,
        email,
        gender,
        birthDate,
        avatar,
      },
    });
  },
};
