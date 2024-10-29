const express = require("express");
const { addCommentar } = require("../controllers/community-controller");
// const { regist, login, getUser } = require("../controllers/auth-controller");

const route = express.Router();

route.post("/commentar", addCommentar);
// route.get("/");
// route.get("/:id");
// route.put("/:id");
// route.delete("/:id");

module.exports = route;
