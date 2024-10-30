const Cases = require("../models/Cases");

module.exports = {
  getCases: async (req, res) => {
    const { userId } = req.payload;

    const data = await Cases.find({ createdBy: userId });

    res.json({
      message: "berhasil mendapatkan data semua user",
      data,
    });
  },

  addCases: async (req, res) => {
    const { userId } = req.payload;
    const { title, description, category, message, createdBy } = req.body;

    if (!title) {
      return res.json({
        message: "Judul Kasus tidak boleh kosong",
      });
    }

    if (!description) {
      return res.json({
        message: "Ringkasan Kasus tidak boleh kosong",
      });
    }

    if (!category) {
      return res.json({
        message: "Kategori tidak boleh kosong",
      });
    }

    try {
      const newCases = new Cases({
        title,
        description,
        category,
        message,
        createdBy: userId,
      });
      await newCases.save();
      res.status(201).json({
        message: "Berhasil Upload",
        data: {
          title,
          description,
          category,
          message,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "Gagal upload Pengajuan Kasus",
      });
    }
  },

  approved: async (req, res) => {},
};
