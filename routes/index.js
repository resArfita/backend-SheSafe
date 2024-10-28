const express = require("express");
const route = express.Router();
const eduRoute = require("./edu-route");
const authRoute = require("./auth-route");

route.get("/", (req, res) => {
  res.json({
    message: "selamat datang di TODOLIST",
  });
});

route.use("/eduShesafe", eduRoute);
route.use("/auth", authRoute);

module.exports = route;
