const express = require("express");
const { addCategory } = require("../controllers/category-controller");

const route = express.Router();

route.post("/", addCategory);
route.get("/");
route.get("/:id");
route.put("/:id");
route.delete("/:id");

module.exports = route;
