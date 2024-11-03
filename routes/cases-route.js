const express = require("express");
const {
  addCases,
  getCases,
  editCases,
  deletedCases,
  getCasesById,
  addCasesDraft,
  getJournalforCasesByID,
  getJournalById,
  getAllCasesPaginationStatus,
  getCasesByCategoryName,
} = require("../controllers/cases-controller");
// const { regist, login, getUser } = require("../controllers/auth-controller");

const route = express.Router();

route.post("/", addCases);
route.post("/draft", addCasesDraft);
route.get("/", getCases);
route.get("/page/", getAllCasesPaginationStatus);
route.get("/category", getCasesByCategoryName);
route.get("/:id", getCasesById);
route.put("/", editCases);
route.delete("/", deletedCases);
route.get("/byjournal/:id", getJournalforCasesByID);
route.get("/byjournal", getJournalById);

module.exports = route;
