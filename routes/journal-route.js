const express = require("express")
const route = express.Router()
const { getAllJournal, getJournalById, addJournal, editJournal, deleteJournal } = require("../controllers/journal-controller")

route.get("/", getAllJournal) //get Journal
route.get("/:id", getJournalById) //get Journal by id
route.post("/", addJournal) //add Journal
route.put("/:id", editJournal) //edit journal
route.delete("/:id", deleteJournal) //delete by id

module.exports = route