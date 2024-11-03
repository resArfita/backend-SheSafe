const express = require("express");
const route = express.Router();

const userRoute = require("./user-route");
const profileRoute = require("./profile-route");
const journalRoute = require("./journal-route");
const communityRoute = require("./community-route");
const authRoute = require("./auth-route");
const catRoute = require("./category-route");
const casesRoute = require("./cases-route");
const adminRoute = require("./admin-route");
const approvedRoute = require("./approved-route");
const { validateToken } = require("../middleware/auth");
const { adminMiddleware } = require("../middleware/admin");

route.get("/", (req, res) => {
  res.json({
    message: "selamat datang di SHESAFE datasets",
  });
});
// route.use("/eduShesafe", eduRoute);
route.use("/auth", authRoute);
route.use("/users", validateToken, userRoute);
route.use("/journal", validateToken, journalRoute);
route.use("/profile", validateToken, profileRoute);
route.use("/community", validateToken, communityRoute);
route.use("/cases", validateToken, casesRoute);
route.use("/category", adminMiddleware, catRoute);
route.use("/admin", adminRoute);
route.use("/approved", adminMiddleware, approvedRoute);

module.exports = route;
