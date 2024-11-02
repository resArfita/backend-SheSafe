const Journal = require("../models/Journal")

module.exports = {
    getAllJournal: async (req, res) => {
        const data = await Journal.find({}).populate("createdBy")

        res.json({
            message: "Berhasil mendapatkan semua Journal",
            data
        })
    },
    getDetailJournal: async (req, res) => {
        const { id } = req.params

        const findJournal = await Journal.findById(id)

        res.json({
            message: "Berhasil mendapatkan detail Journal by id",
            findJournal
        })
    },
    getJournalByIdUser: (req, res) => {
        const { id } = req.params

        Journal.find({ createdBy: id }).populate("createdBy")
            .then(data => {
                res.json({
                    message: "Berhasil mendapatkan Journal by id user",
                    data
                })
            })
            .catch(err => {
                res.json({
                    message: "Gagal mendapatkan Journal by id user",
                    err
                })
            })
    },
    addJournal: (req, res) => {
        const data = req.body

        //check if file uploaded
        if(req.file){
            console.log("File uploaded: ", req.file)
            data.file = `/journal-assets/${req.file.filename}`
        }else{
            console.log("No file uploaded")
        }

        const newJournal = new Journal(data)
        newJournal.save()
        .then((savedJournal) => {
            res.json({
            message: "Journal berhasil dibuat",
            savedJournal
            })
        })
        .catch((e) => {
            console.log("Error saving journal", e)
            res.json({
                message: "Gagal buat Journal"
            })
        })
        
    },
    editJournal: async (req, res) => {
        const { id } = req.params

        // const editDataJournal = await Journal.findByIdAndUpdate(id, req.body)
        // editDataJournal.save()

        const editData = {
            ...req.body,
            edited: new Date() //auto set edit date
        }

        if(req.file){
            console.log("File uploaded: ", req.file)
            editData.file = `/journal-assets/${req.file.filename}`
        }

        const updatedJournal = await Journal.findByIdAndUpdate(id, editData, { new: true })
        res.json({
            message: "Berhasil update Journal",
            updatedJournal
        })
    },
    deleteJournal: async (req, res) => {
        const { id } = req.params

        await Journal.findByIdAndDelete(id)

        res.json({
            message: "Berhasil hapus Journal"
        })
    },
}