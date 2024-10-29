const Commentar = require("../models/Commentar");

// Controller untuk menambahkan komentar
const addCommentar = async (req, res) => {
  try {
    const { description } = req.body; // Ambil data dari body permintaan

    // Validasi input
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const newCommentar = new Commentar({
      created: new Date(), // Menetapkan tanggal saat ini
      description,
      // userID: req.body.userID, // Uncomment jika userID diperlukan
      // CasesID: req.body.CasesID, // Uncomment jika CasesID diperlukan
    });

    await newCommentar.save(); // Simpan komentar baru ke database

    return res.status(201).json({
      message: "Commentar created successfully",
      data: newCommentar,
    });
  } catch (error) {
    console.error("Error creating commentar:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addCommentar };
