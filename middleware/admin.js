require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  validateToken: (req, res, next) => {
    const cookie = req.cookies.token;

    if (!cookie) {
      res.status(401).json({
        message: "Token tidak ditemukan",
      });
      return;
    }

    const token = cookie.split(" ")[1];

    if (!token) {
      res.json("invalid token");
      return;
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_KEY);
      req.payload = payload;
      next();
    } catch {
      res.status(400).json({
        message: "invalid token",
      });
      return;
    }
  },
};
