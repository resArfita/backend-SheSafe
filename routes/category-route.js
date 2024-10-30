const express = require("express");
// const { regist, login, getUser } = require("../controllers/auth-controller");

const route = express.Router();

route.post("/");
route.get("/");
route.get("/:id");
route.put("/:id");
route.delete("/:id");

module.exports = route;
