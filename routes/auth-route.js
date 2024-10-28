const express = require("express");
// const { regist, login, getUser } = require("../controllers/auth-controller");

const route = express.Router();

route.post("/regist");
route.post("/login");
route.get("/users");

module.exports = route;
