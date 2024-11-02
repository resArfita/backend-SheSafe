const express = require("express");
const { regist, login, logout } = require("../controllers/auth-controller");

const route = express.Router();

route.post("/regist", regist);
route.post("/login", login);
route.post("/logout", logout);
// route.get("/users", getUser);

module.exports = route;
