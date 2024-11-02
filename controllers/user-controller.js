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

        //check if file uploaded
        if(req.file){
            console.log("File uploaded: ", req.file)
            data.avatar = `/userID-assets/${req.file.filename}` //rename jadi data.avatar
        }else{
            console.log("No file uploaded")
        }

        const newUser = new User(data)
        newUser.save()
        .then((savedUser) => {
            res.json({
            message: "User berhasil dibuat",
            savedUser
            })
        })
        .catch((e) => {
            console.log("Error saving user data", e)
            res.json({
                message: "Gagal membuat user"
            })
        })
        
    },
    editUser: async (req, res) => {
        const { id } = req.params

        // const editUser = await User.findByIdAndUpdate(id, req.body)
        // editUser.save()

        const editData =  {
            ...req.body,
            edited: new Date() //auto set edit date
        }

        if(req.file){
            console.log("File uploaded: ", req.file)
            editData.file = `/userID-assets/${req.file.filename}`
        }

        const updatedUser = await User.findByIdAndUpdate(id, editData, { new: true })
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
    editUserProfile: async (req, res) => {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const updatedData = {
            fullName: req.body.fullName || user.fullName, 
            edited: new Date(), 
        };
    
        if (req.file) {
            console.log("File uploaded: ", req.file);
            updatedData.avatar = `/userID-assets/${req.file.filename}`; 
        }
    
        try {
            const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
            res.json({
                message: "Berhasil mengupdate profil",
                updatedUser,
            });
        } catch (error) {
            console.error("Error updating user data", error);
            res.status(500).json({
                message: "Gagal mengupdate profil",
                error: error.message,
            });
        }
    },
}