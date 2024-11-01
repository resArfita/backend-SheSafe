const Cases = require("../models/Cases");
const Commentar = require("../models/Commentar");
const Support = require("../models/Support");

// Controller untuk menambahkan komentar
module.exports = {
  getCommunity: async (req, res) => {
    try {
      const data = await Cases.find({ isApproved: "Approved" }).sort({
        approved: "desc",
      });

      if (data && data.length > 0) {
        return res.status(200).json({
          message: "Berhasil Menampilkan Data",
          data,
        });
      } else {
        return res.status(404).json({
          message: "Data tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({
        message: "Gagal menampilkan data",
      });
    }
  },

  getCommunityById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Cases.find({ _id: id, isApproved: "Approved" });

      if (data && data.length > 0) {
        return res.status(200).json({
          message: "Berhasil Menampilkan Data",
          data,
        });
      } else {
        return res.status(404).json({
          message: "Data tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({
        message: "Gagal menampilkan data",
      });
    }
  },

  addCommentar: async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;
      const { userId } = req.payload;

      // Validasi input
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }

      const newCommentar = new Commentar({
        created: new Date(),
        description,
        createdBy: userId,
        casesID: id,
      });

      await newCommentar.save();

      return res.status(201).json({
        message: "Commentar created successfully",
        data: newCommentar,
      });
    } catch (error) {
      console.error("Error creating commentar:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getCommentar: async (req, res) => {
    try {
      const { id } = req.params;
      const commentar = await Commentar.find({ caseId: id })
        .populate(createdBy)
        .sort({
          created: "desc",
        });

      if (commentar) {
        res.status(200).json({
          message: "berhasil menampilan commentar",
          commentar,
        });
      } else {
        res.status(400).json({
          message: "data tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({
        message: "Gagal menampilkan data",
      });
    }
  },

  //ini buat di halaman detail komunitas
  addSupportById: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.payload;
      const { count } = req.body;

      const checkSupport = await Support.findOne({ createdBy: userId });
      if (checkSupport) {
        return res.json({
          message: "Anda sudah memberikan dukungan",
        });
      }

      const newSupport = new Support({
        casesID: id,
        createdBy: userId,
        created: new Date(),
        count,
      });
      await newSupport.save();

      const dataSupport = await Support.find().countDocuments();

      const addSupport = await Cases.findOneAndUpdate(
        { _id: id },
        {
          supportCounter: dataSupport,
        },
        { new: true }
      );

      if (addSupport) {
        return res.status(201).json({
          message: "Berhasil Memberikan Dukungan",
          data: {
            casesID: id,
            createdBy: userId,
            created: new Date(),
            count,
          },
          supportCounter: addSupport.supportCounter,
        });
      } else {
        return res.status(400).json({
          message: "Gagal",
        });
      }
    } catch (error) {
      console.error("Error creating support:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  //ini dari halaman beranda komunitas
  addSupport: async (req, res) => {
    try {
      const { userId } = req.payload;
      const { count, id } = req.body;

      const checkSupport = await Support.findOne({ createdBy: userId });
      if (checkSupport) {
        return res.json({
          message: "Anda sudah memberikan dukungan",
        });
      }
      const newSupport = new Support({
        casesID: id,
        createdBy: userId,
        created: new Date(),
        count,
      });
      await newSupport.save();

      const dataSupport = await Support.find().countDocuments();

      const addSupport = await Cases.findOneAndUpdate(
        { _id: newSupport.casesID },
        {
          supportCounter: dataSupport,
        },
        { new: true }
      );

      if (addSupport) {
        return res.status(201).json({
          message: "Berhasil Memberikan Dukungan",
          data: {
            casesID: newSupport.casesID,
            createdBy: userId,
            created: new Date(),
            count,
          },
          supportCounter: addSupport.supportCounter,
        });
      } else {
        return res.status(400).json({
          message: "Gagal",
        });
      }
    } catch (error) {
      console.error("Error creating support:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteSupport: async (req, res) => {
    try {
      const { userId } = req.payload;
      const { id } = req.body;

      // Menghapus dukungan berdasarkan casesID dan createdBy
      const deleteSupport = await Support.deleteOne({
        casesID: id,
        createdBy: userId,
      });

      // Memastikan dukungan telah dihapus
      if (deleteSupport.deletedCount === 0) {
        return res.status(404).json({
          message: "Dukungan tidak ditemukan atau sudah dihapus.",
        });
      }

      // Menghitung total dukungan yang tersisa
      const dataSupport = await Support.countDocuments();

      // Memperbarui supportCounter pada model Cases
      const updateSupport = await Cases.findOneAndUpdate(
        { _id: id },
        {
          supportCounter: dataSupport,
        },
        { new: true }
      );

      // Mengirimkan respons setelah semua operasi selesai
      return res.status(200).json({
        message: "Berhasil menghapus Dukungan",
        supportCounter: updateSupport.supportCounter,
      });
    } catch (error) {
      console.error("Error deleting support:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteSupportById: async (req, res) => {
    try {
      const { userId } = req.payload;
      const { id } = req.params;

      // Menghapus dukungan berdasarkan casesID dan createdBy
      const deleteSupport = await Support.deleteOne({
        casesID: id,
        createdBy: userId,
      });

      // Memastikan dukungan telah dihapus
      if (deleteSupport.deletedCount === 0) {
        return res.status(404).json({
          message: "Dukungan tidak ditemukan atau sudah dihapus.",
        });
      }

      // Menghitung total dukungan yang tersisa
      const dataSupport = await Support.countDocuments();

      // Memperbarui supportCounter pada model Cases
      const updateSupport = await Cases.findOneAndUpdate(
        { _id: id },
        {
          supportCounter: dataSupport,
        },
        { new: true }
      );

      // Mengirimkan respons setelah semua operasi selesai
      return res.status(200).json({
        message: "Berhasil menghapus Dukungan",
        supportCounter: updateSupport.supportCounter,
      });
    } catch (error) {
      console.error("Error deleting support:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
