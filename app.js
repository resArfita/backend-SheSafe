const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const allRoute = require("./routes");
const db = require("./db");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

db.then(() => {
  console.log("berhasil connect ke database");
}).catch((e) => {
  console.log("gagal connect ke database");
  console.log(e)
});

app.listen(PORT, () => {
  console.log("server running on PORT " + PORT);
});

app.use(express.json());

app.use(allRoute);
