require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const allRoute = require("./routes");
const db = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = process.env.ALLOWED_ORIGINS;
      console.log("Incoming Origin:", origin); // Debugging untuk memastikan origin diterima
      if (!origin) {
        return callback(null, true); // Izinkan permintaan tanpa origin (misalnya dari Postman)
      }

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `This origin ${origin} is not allowed.`;
        console.log(msg); // Jika origin tidak diizinkan
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },

    methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true, // Mengizinkan cookies dan kredensial lainnya
  })
);
// app.options("*", cors());

app.use(express.json());
db.then(() => {
  console.log("berhasil connect ke database");
}).catch((e) => {
  console.log("gagal connect ke database");
  console.log(e);
});

app.listen(PORT, () => {
  console.log("server running on PORT " + PORT);
});

app.use(allRoute);
