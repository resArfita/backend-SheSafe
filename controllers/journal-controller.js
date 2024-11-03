const Journal = require("../models/Journal");

module.exports = {
  //jurnal yang hanya bisa diliat oleh user itu sendiri,
  getJournalByIdUser: async (req, res) => {
    //rename nama function
    const { userId } = req.user; //tambah req.user
    const { page = 1, perPage = 10, sort = "desc" } = req.query; //rename limit to perPage
    const sortOrder = sort === "asc" ? 1 : -1;

    try {
      const data = await Journal.find({ createdBy: userId }) // tambah createdBy:userId
        .populate("createdBy")
        .sort({ created: sortOrder })
        .skip((page - 1) * perPage)
        .limit(perPage);

      const total = await Journal.countDocuments();
      res.json({
        message: "Berhasil mendapatkan semua Journal",
        data,
        totalPages: Math.ceil(total / perPage),
        currentPage: page,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gagal mendapatkan jurnal", error: error.message });
    }
  },

  getDetailJournal: async (req, res) => {
    const { id } = req.params;

    const findJournal = await Journal.findById(id);

    res.json({
      message: "Berhasil mendapatkan detail Journal by id",
      findJournal,
    });
  },

  // Vita: tambah kondisi createdBy dari payload req.user
  addJournal: (req, res) => {
    const data = req.body;
    const { userId } = req.user;

    //check if file uploaded
    if (req.file) {
      console.log("File uploaded: ", req.file);
      data.file = `/journal-assets/${req.file.filename}`;
    } else {
      console.log("No file uploaded");
    }

    const newJournal = new Journal({ ...data, createdBy: userId });
    newJournal
      .save()
      .then((savedJournal) => {
        res.json({
          message: "Journal berhasil dibuat",
          savedJournal,
        });
      })
      .catch((e) => {
        console.log("Error saving journal", e);
        res.json({
          message: "Gagal buat Journal",
        });
      });
  },
  editJournal: async (req, res) => {
    const { id } = req.params;

    const editData = {
      ...req.body,
      edited: new Date(), //auto set edit date
    };

    if (req.file) {
      console.log("File uploaded: ", req.file);
      editData.file = `/journal-assets/${req.file.filename}`;
    }

    const updatedJournal = await Journal.findByIdAndUpdate(id, editData, {
      new: true,
    });
    res.json({
      message: "Berhasil update Journal",
      updatedJournal,
    });
  },
  deleteJournal: async (req, res) => {
    const { id } = req.params;

    await Journal.findByIdAndDelete(id);

    res.json({
      message: "Berhasil hapus Journal",
    });
  },
};
