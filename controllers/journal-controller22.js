const Journal = require("../models/Journal");
require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = {
  //jurnal yang hanya bisa diliat oleh user itu sendiri,
  getJournalByIdUser: async (req, res) => {
    //rename nama function
    const { userId } = req.user; //tambah req.user
    const { page = 1, perPage = 10, sort = "desc" } = req.query; //rename limit to perPage
    const sortOrder = sort === "asc" ? 1 : -1;

    try {
      const data = await Journal.find({ createdBy: userId }) // tambah createdBy:userId
        .populate("createdBy", "fullName")
        .populate("category", "name")
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

    const findJournal = await Journal.findById(id).populate("category", "name");

    res.json({
      message: "Berhasil mendapatkan detail Journal by id",
      findJournal,
    });
  },

  // Vita: tambah kondisi createdBy dari payload req.user
  addJournal: async (req, res) => {
    try {
      const { title, startDate, endDate, category, description, cronology } = req.body;
      const { userId } = req.user;
      let fileData = {};


      // Check if file uploaded
      if (req.file) {
        fileData = {
          path: req.file.path, // Cloudinary secure URL sama kyk cloudinary.url()
          public_id: req.file.filename,  // Cloudinary public ID
          originalname: req.file.originalname // Original filename
        };
      } 

      const newJournal = new Journal({ 
        title,
        startDate,
        endDate,
        category,
        description,
        cronology,
        file: fileData, 
        createdBy: userId,
      });
      


      // Hitung jumlah jurnal yang telah ditulis oleh pengguna
      const journalCount = await Journal.countDocuments({ createdBy: userId });

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const logo =
        "https://drive.google.com/uc?id=1V4KlEDZT_TTSqAF9oje2dsOaHvNwzocY";

      // Fungsi untuk mengirim email notifikasi refleksi
      const sendReflectionEmail = (subject, message) => {
        const mailOptions = {
          from: process.env.SMTP_USER,
          to: req.user.email,
          subject: subject,
          html: `
                    <!DOCTYPE html>
                    <html lang="id">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Notifikasi Refleksi</title>
                        <style>
                            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                            .container { max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px; }
                            h1 { color: #333; }
                            p { font-size: 16px; color: #555; }
                            .logo { max-width: 30%; height: auto; margin-bottom: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src=${logo} class="logo">
                            <h1>Notifikasi Refleksi</h1>
                            <p>${message}</p>
                        </div>
                    </body>
                    </html>
                `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Email sent: " + info.response);
        });
      };

      // Mengirim email berdasarkan jumlah jurnal yang ditulis
      switch (journalCount) {
        case 1:
          sendReflectionEmail(
            "SheSafe:Refleksi Hari Pertama",
            "Hai, bagaimana kabarmu hari ini? Terima kasih sudah membagikan ceritamu kemarin. Jika merasa butuh waktu, tidak apa-apa, kami di sini untuk mendukungmu."
          );
          break;
        case 3:
          sendReflectionEmail(
            "SheSafe:Refleksi Hari Ketiga",
            "Halo, apakah kamu merasa lebih baik? Kadang menulis bisa membantu meredakan perasaan. Jangan lupa, kamu bisa mengajukan kasus kapan saja jika merasa perlu. Kami selalu siap mendukung."
          );
          break;
        case 7:
          sendReflectionEmail(
            "SheSafe:Refleksi Hari Ketujuh",
            "Hai, bagaimana perasaanmu setelah seminggu berlalu? Jangan ragu untuk kembali menulis atau melihat jurnal yang kamu buat. Jika butuh bantuan, ingatlah bahwa kamu tidak sendiri."
          );
          break;
        case 14:
          sendReflectionEmail(
            "SheSafe:Refleksi Hari Keempat Belas",
            "Hai, sudah dua minggu sejak kamu menulis jurnal. Apakah kamu ingin melanjutkan ceritamu atau butuh dukungan lebih? Tim SheSafe siap mendengarkan kapan saja."
          );
          break;
        case 30:
          sendReflectionEmail(
            "SheSafe:Refleksi Hari Ketigapuluh",
            "Sudah satu bulan sejak kamu membagikan pengalamanmu. Jika kamu merasa ada hal baru yang ingin dibagikan atau butuh bantuan, kami di sini mendukungmu. Tetap kuat dan ingat, kamu memiliki komunitas yang peduli."
          );
          break;
        default:
          break; // Tidak ada email yang dikirim jika jumlah tidak sesuai
      }


      await newJournal.save();
      res.json({
        message: "Journal berhasil dibuat",
        newJournal,
      });
    } catch (error) {
      console.log("Error saving journal", error);
      res.json({
        message: "Gagal buat Journal",
      });
    }
  },

  editJournal: async (req, res) => {
    const { id } = req.params;
    const { title, startDate, endDate, category, description, cronology } = req.body;
    const journalData = { title, startDate, endDate, category, description, cronology, edited: new Date() };


    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid journal ID' });
    }

    try {
      //check apakah ada file baru diupload
      if (req.file) {
        journalData.file = {
          path: req.file.path, // cloudinary url
          public_id: req.file.filename,
          originalname: req.file.originalname
        };
      } else {
        //tampilkan journal yang sudah ada
        const existingJournal = await Journal.findById(id);
        if (existingJournal) {
          journalData.file = existingJournal.file;
        }
      }
      

      const updatedJournal = await Journal.findByIdAndUpdate(id, journalData, { new: true });
      if (!updatedJournal) return res.status(404).json({ message: "Journal not found" });
      
      res.status(200).json({ message: "Berhasil edit journal", updatedJournal });
    } catch (error) {
      console.error("gagal update journal", error)
      return res.json({ message: "Internal server error, try again later" })
    }
  },

  deleteJournal: async (req, res) => {
    const { id } = req.params;

    await Journal.findByIdAndDelete(id);

    res.json({
      message: "Berhasil hapus Journal",
    });
  },
};
