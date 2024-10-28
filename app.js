const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const allRoute = require("./routes");
const db = require("./db");

db.then(() => {
  console.log("berhasil connect ke database");
}).catch(() => {
  console.log("gagal connect ke database");
});

app.listen(PORT, () => {
  console.log("server running on PORT" + 3000);
});

app.use(express.json());

app.use(allRoute);
