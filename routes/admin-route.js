const express = require("express");

const { regist, login, getUser } = require("../controllers/admin-controller");

const route = express.Router();
route.post("/register", regist);
route.post("/login", login);
route.get("/users", getUser);

module.exports = route;
