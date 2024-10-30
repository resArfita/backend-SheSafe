const express = require("express");
const {
  approvedCases,
  approvedUser,
} = require("../controllers/approved-controller");

const route = express.Router();
route.put("/case", approvedCases);
route.put("/user", approvedUser);

module.exports = route;
