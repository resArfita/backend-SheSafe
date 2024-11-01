const express = require("express");
const {
  addCommentar,
  getCommunity,
  getCommunityById,
  getCommentar,
  addSupportById,
  addSupport,
} = require("../controllers/community-controller");
// const { regist, login, getUser } = require("../controllers/auth-controller");

const route = express.Router();

route.post("/commentar/:id", addCommentar);
route.get("/commentar/:id", getCommentar);
route.get("/", getCommunity);
route.get("/:id", getCommunityById);
route.post("/:id/support", addSupportById);
route.post("/support", addSupport);

// route.put("/:id");
// route.delete("/:id");

module.exports = route;
