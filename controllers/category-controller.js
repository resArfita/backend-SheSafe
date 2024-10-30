const Category = require("../models/Category");

module.exports = {
  getAllCategory: async (req, res) => {
    const data = await Category.find([]);

    res.json({
      message: "berhasil mendapatkan data",
      data,
    });
  },

  addCategory: (req, res) => {
    const { name, createdBy } = req.body;
    const { adminId } = req.payload;
    // Validasi untuk memastikan description dan task diinput
    if (!name) {
      return res.status(400).json({
        message: "Nama tidak boleh kosong",
      });
    }
    const newCategory = new Category({
      name,
      createdBy: adminId,
    });

    newCategory.save();
    res.json({
      message: "data berhasil ditambahkan",
      data: {
        name,
        createdBy,
      },
    });
  },

  editCategory: async (req, res) => {
    const { _id, name, createdBy } = req.body;
    if (!name || !createdBy) {
      return res.status(400).json({
        message: "Nama dan createdBy tidak boleh kosong",
      });
    }
    try {
      const updatedCategory = await Category.findByIdAndUpdate({
        _id,
        name,
        createdBy,
      });
      if (!updatedCategory) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      res.json({
        message: "Data berhasil diedit",
        data: updatedCategory,
      });
    } catch (error) {
      res.status(500).json({
        message: "Terjadi kesalahan saat mengedit data",
        error: error.message,
      });
    }
  },

  deleteCategoryById: async (req, res) => {
    const { _id } = req.body;
    try {
      const deletedCategory = await Category.findByIdAndDelete(_id);
      if (!deletedCategory) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      res.json({
        message: "Data berhasil dihapus",
        data: deletedCategory,
      });
    } catch (error) {
      res.status(500).json({
        message: "Terjadi kesalahan saat menghapus data",
        error: error.message,
      });
    }
  },
};

//test
