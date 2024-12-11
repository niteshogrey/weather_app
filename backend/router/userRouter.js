const express = require("express")
const {getResponse, registerUser, updateUser, login} = require("../controller/userCtrl")
const user = express.Router()

user.get('/', getResponse )
user.post('/register', registerUser) //http://localhost:1000/api/user/register
user.post('/login', login)
user.put('/update/:id', updateUser)


module.exports = user