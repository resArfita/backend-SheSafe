const express = require("express")
const route = express.Router()
const { getAllUser, getUserById, addUser, deleteUser, editUser } = require("../controllers/user-controller")

route.get("/", getAllUser) //get User
route.get("/:id", getUserById) //get User by id
route.post("/", addUser) //add User
route.put("/:id", editUser) //edit user
route.delete("/:id", deleteUser) //delete by id

module.exports = route