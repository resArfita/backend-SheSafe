const express = require("express");
const { approvedCases } = require("../controllers/approved-controller");

const route = express.Router();
route.put("/case/:id", approvedCases);

module.exports = route;
