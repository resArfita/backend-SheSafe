const express = require("express");
const { addCases, getCases } = require("../controllers/cases-controller");
// const { regist, login, getUser } = require("../controllers/auth-controller");

const route = express.Router();

route.post("/", addCases);
route.get("/", getCases);
route.get("/:id");
route.put("/:id");
route.delete("/:id");

module.exports = route;
