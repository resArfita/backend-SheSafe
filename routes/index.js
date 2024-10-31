const express = require("express");
const route = express.Router();
const eduRoute = require("./edu-route");
const authRoute = require("./auth-route");
const journalRoute = require("./journal-route");
const userRoute = require("./user-route")

route.get("/", (req, res) => {
  res.json({
    message: "selamat datang di SHESAFE datasets",
  });
});

route.use("/eduShesafe", eduRoute);
route.use("/auth", authRoute);
route.use("/journal", journalRoute);
route.use("/users", userRoute);

module.exports = route;
