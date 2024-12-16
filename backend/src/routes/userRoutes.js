const express = require("express")
const { register, login, resetDatabase, getResponse } = require("../controllers/userController")
const user = express.Router()

user.get('/', getResponse )
user.post('/register', register) //http://localhost:1000/api/user/register
user.post('/login', login)
user.post('/resetDatabase', resetDatabase)



module.exports = user