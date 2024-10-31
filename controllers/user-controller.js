const User = require("../models/User")

module.exports = {
    getAllUser: async (req, res) => {
        const data = await User.find({})

        res.json({
            message: "Berhasil mendapatkan semua User",
            data
        })
    },
    addUser: (req, res) => {
        const data = req.body

        const newUser = new User(data)
        newUser.save()

        res.json({
            message: "User berhasil dibuat"
        })
    },
    editUser: async (req, res) => {
        const { id } = req.params

        const editUser = await User.findByIdAndUpdate(id, req.body)
        editUser.save()

        const updatedUser = await User.findById(id)
        res.json({
            message: "Berhasil mengupdate user",
            updatedUser
        })
    },
    deleteUser: async (req, res) => {
        const { id } = req.params

        await User.findByIdAndDelete(id)

        res.json({
            message: "berhasil hapus user"
        })
    },
    getUserById: async (req, res) => {
        const { id } = req.params

        const findUserbyId = await User.findById(id)

        res.json({
            message: "berhasil mendapatkan user by id",
            findUserbyId
        })
    },
}