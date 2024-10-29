const express = require("express");
const route = express.Router();

const communityRoute = require("./community-route");
const authRoute = require("./auth-route");

// route.use("/eduShesafe", eduRoute);
route.use("/auth", authRoute);
route.use("/community", communityRoute);

module.exports = route;
