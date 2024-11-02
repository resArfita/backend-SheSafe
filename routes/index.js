const express = require("express");
const route = express.Router();
const eduRoute = require("./edu-route");
const authRoute = require("./auth-route");
const journalRoute = require("./journal-route");
const userRoute = require("./user-route")
const { validateToken } = require("../middleware/auth")

route.get("/", (req, res) => {
  res.json({
    message: "selamat datang di SHESAFE datasets",
  });
});

route.use("/auth", authRoute);
route.use("/journal", validateToken, journalRoute);
route.use("/users", validateToken, userRoute);
route.use("/eduShesafe", eduRoute);

module.exports = route;
