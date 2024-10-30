const express = require("express");
const route = express.Router();

const communityRoute = require("./community-route");
const authRoute = require("./auth-route");
const catRoute = require("./category-route");
const casesRoute = require("./cases-route");
const authMiddleware = require("../middleware/auth");

// route.use("/eduShesafe", eduRoute);
route.use("/auth", authRoute);
route.use("/community", communityRoute);
route.use("/cases", authMiddleware, casesRoute);
route.use("/category", catRoute);

module.exports = route;
