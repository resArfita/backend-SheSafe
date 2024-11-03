const express = require("express")
const route = express.Router()
const { getAllJournal, getJournalByIdUser, addJournal, editJournal, deleteJournal, getDetailJournal, getJournalsPaginationByCategory, getJournalByCategoryAndSort } = require("../controllers/journal-controller")
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "journal-assets")
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname) //buat generate unique file name
        cb(null, uniqueName)
    }
})

//filter file type
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|mp4|pdf/
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedFileTypes.test(file.mimetype)

    if(mimetype && extname) {
        cb(null, true)
    }else{
        cb(new Error("Only image and video files are allowed"))
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } //limit 10MB
})

route.get("/", getAllJournal) //get Journal
route.get("/userJournal/:id", getJournalByIdUser) //get Journal by id user
route.get("/:id", getDetailJournal) //get Detail journal by id
route.post("/", upload.single("file"), addJournal) //add Journal
route.put("/:id", upload.single("file"), editJournal) //edit journal
route.delete("/:id", deleteJournal) //delete by id
route.get("/category", getJournalsPaginationByCategory); // journals by category name, pagination
route.get("/category/sort", getJournalByCategoryAndSort); // journals by category name, sorting, pagination
module.exports = route