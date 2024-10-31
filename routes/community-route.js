const express = require("express");
const {
  addCommentar,
  getCommunity,
  getCommunityById,
} = require("../controllers/community-controller");
// const { regist, login, getUser } = require("../controllers/auth-controller");

const route = express.Router();

route.post("/commentar/:id", addCommentar);
route.get("/", getCommunity);
route.get("/:id", getCommunityById);
// route.put("/:id");
// route.delete("/:id");

module.exports = route;
