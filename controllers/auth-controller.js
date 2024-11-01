require("dotenv").config();
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports = {
    regist: async (req, res) => {
        const data = req.body
        // console.log(data)

        //password hashing
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(data.password, salt)
        data.password = hash
        // console.log(data)

        const newUser = new User(data)
        await newUser.save()

        res.json({
            message: "Berhasil registrasi",
            newUser
        })
    },
    login: async (req, res) => {
        const data = req.body

        //check if the user exist in db
        const user = await User.findOne({email: data.email}).exec()
        if(!user) return res.json({message: "Gagal login, apakah kamu sudah registrasi ?"})

        //if user exist -> compare pass w/ bcrypt
        const checkPassword = bcrypt.compareSync(data.password, user.password)
        if(!checkPassword) return res.json({message: "Gagal login"})


        //token
        const token = jwt.sign(
            {email: user.email, fullName: user.fullName}, //payload
            process.env.JWT_KEY //secretkey
        )

        res.cookie("tokenUser", token, {
            httpOnly: true,
            secure:false,
        })

        res.json({
            message: "Berhasil login",
            token
        })
    },

    logout: (req, res) => {
        res.clearCookie("tokenUser")
        res.json({message: "berhasil Logout"})
    },
};
