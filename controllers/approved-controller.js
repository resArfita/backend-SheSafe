const Cases = require("../models/Cases");
// const { ObjectId } = require("mongoose").Types;

module.exports = {
  approvedCases: async (req, res) => {
    const { id } = req.params;
    const { isApproved, notes, isAnonimous } = req.body;
    const { adminId } = req.payload;

    const counter = Math.round(Math.random() * 1e9);

    try {
      const updateApprove = await Cases.findOneAndUpdate(
        { _id: id },
        {
          approvedBy: adminId,
          isAnonimous: "Anonim" + counter,
          isApproved,
          notes,
          approved: new Date(),
        }
      );

      if (updateApprove) {
        res.status(200).json({
          message: "Approve berhasil",
          updateApprove,
        });
      } else {
        res.status(404).json({
          message: "Dokumen tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Error:", error); // Logging error for debugging
      res.status(400).json({
        message: "Gagal",
        error: error.message,
      });
    }
  },
};
