const Journal = require("../models/Journal");

module.exports = {
  getAllJournal: async (req, res) => {
    const data = await Journal.find({})
      .populate("createdBy")
      .sort({ created: "desc" });

    res.json({
      message: "Berhasil mendapatkan semua Journal",
      data,
    });
  },
  getDetailJournal: async (req, res) => {
    const { id } = req.params;

    const findJournal = await Journal.findById(id);

    res.json({
      message: "Berhasil mendapatkan detail Journal by id",
      findJournal,
    });
  },
  //vita: edit iduser diambil dari req.user, tambah sort created desc
  getJournalByIdUser: (req, res) => {
    const { userId } = req.user;

    Journal.find({ createdBy: userId })
      .populate("createdBy")
      .sort({ created: "desc" })
      .then((data) => {
        res.json({
          message: "Berhasil mendapatkan Journal by id user",
          data,
        });
      })
      .catch((err) => {
        res.json({
          message: "Gagal mendapatkan Journal by id user",
          err,
        });
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

    // const editDataJournal = await Journal.findByIdAndUpdate(id, req.body)
    // editDataJournal.save()

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
  getAllJournalsPagination: async (req, res) => {
    const { page = 1, limit = 10, sort = 'desc' } = req.query; 
    const sortOrder = sort === 'asc' ? 1 : -1; 
  
    try {
      const data = await Journal.find({})
        .populate("createdBy")
        .sort({ created: sortOrder }) 
        .skip((page - 1) * limit) 
        .limit(limit);
  
      const total = await Journal.countDocuments(); 
      res.json({
        message: "Berhasil mendapatkan semua Journal",
        data,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ message: "Gagal mendapatkan jurnal", error: error.message });
    }
  },
  getJournalsPaginationByCategory: async (req, res) => {
    const { categoryName } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    
    try {
      const category = await Category.findOne({ name: categoryName });
    
      if (!category) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }
    
      const journals = await Journal.find({ category: category._id })
        .populate("createdBy")
        .sort({ created: "desc" })
        .skip((page - 1) * limit)
        .limit(limit);
    
      const totalJournals = await Journal.countDocuments({ category: category._id });
      const totalPages = Math.ceil(totalJournals / limit);
    
      res.json({
        message: "Berhasil mendapatkan Journal berdasarkan kategori",
        data: journals,
        totalPages: totalPages,
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
  },
  getJournalByCategoryAndSort: async (req, res) => {
    const { categoryName } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sort = req.query.sort === 'desc' ? -1 : 1; 

    try {
      const category = await Category.findOne({ name: categoryName });

      if (!category) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }

      const journals = await Journal.find({ category: category._id })
        .populate("createdBy")
        .sort({ created: sort })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalJournals = await Journal.countDocuments({ category: category._id });
      const totalPages = Math.ceil(totalJournals / limit);

      res.json({
        message: "Berhasil mendapatkan Journal berdasarkan kategori dan sortir",
        data: journals,
        totalPages: totalPages,
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
  },
};
