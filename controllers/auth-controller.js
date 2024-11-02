require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  regist: async (req, res) => {
    // const data = req.body
    const { fullName, email, gender, password } = req.body;

    // Validasi input
    if (!fullName) {
      return res.json({ message: "fullname tidak boleh kosong" });
    }

    if (!email) {
      return res.json({ message: "email tidak boleh kosong" });
    }

    if (!gender) {
      return res.json({ message: "gender tidak boleh kosong" });
    }

    if (!password) {
      return res.json({ message: "password tidak boleh kosong" });
    }

    if (!req.file) {
      return res.json({ message: "Bukti Identitas tidak boleh kosong" });
    }

    //password hashing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // console.log(data)

    try {
      // Cek apakah email sudah digunakan
      const checkEmail = await User.findOne({ email });

      if (checkEmail) {
        return res.json({
          message: "Email sudah digunakan, silahkan gunakan Email yang lain",
        });
      }

      const newUser = new User({
        fullName,
        email,
        gender,
        fileIdentity: req.file.path,
        password: hashedPassword, // Use hashed password
      });
      await newUser.save();

      return res.status(201).json({
        message: "Berhasil Registrasi",
        data: {
          fullName: newUser.fullName,
          email: newUser.email,
          gender: newUser.gender,
          fileIdentity: newUser.fileIdentity,
        },
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Gagal Registrasi", error: error.message });
    }
  },

  login: async (req, res) => {
    const data = req.body;
    //CheckAccount
    if (user.isValidated !== "validated") {
      return res
        .status(404)
        .json({ message: "Akun anda belum tervalidasi identitasnya" });
    }

    //check if the user exist in db
    const user = await User.findOne({ email: data.email }).exec();
    if (!user)
      return res.json({
        message: "Gagal login, apakah kamu sudah registrasi ?",
      });

    //if user exist -> compare pass w/ bcrypt
    const checkPassword = await bcrypt.compare(data.password, user.password);
    if (!checkPassword) return res.json({ message: "Gagal login" });

    //token
    try {
      const token = jwt.sign(
        { userId: user._id, fullName: user.fullName, email: user.email }, //payload
        process.env.JWT_KEY //secretkey
      );

      res.cookie("tokenUser", token, {
        httpOnly: true,
        secure: false,
        sameSite: true,
        // { expiresIn: "1h" }
      });

      res.status(201).json({
        message: "Berhasil login",
        token,
      });
    } catch (error) {
      res.status(400).json({ message: "Gagal Login" });
    }
  },

  logout: (req, res) => {
    res.clearCookie("tokenUser");
    res.status(201).json({ message: "berhasil Logout" });
  },
};
