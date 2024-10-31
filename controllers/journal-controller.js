const Journal = require("../models/Journal")

module.exports = {
    getAllJournal: async (req, res) => {
        const data = await Journal.find({}).populate("createdBy")

        res.json({
            message: "Berhasil mendapatkan semua Journal",
            data
        })
    },
    getJournalById: (req, res) => {},
    addJournal: (req, res) => {
        const data = req.body

        const newUser = new Journal(data)
        newUser.save()

        res.json({
            message: "Journal berhasil dibuat"
        })
    },
    editJournal: async (req, res) => {
        const { id } = req.params

        const editJournal = await Journal.findByIdAndUpdate(id, req.body)
        editJournal.save()

        const updatedJournal = await Journal.findById(id)
        res.json({
            message: "berhasil update Journal",
            updatedJournal
        })
    },
    deleteJournal: async (req, res) => {
        const { id } = req.params

        await Journal.findByIdAndDelete(id)

        res.json({
            message: "berhasil hapus Journal"
        })
    },
}