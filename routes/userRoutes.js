import express from 'express';
const routerUser = express.Router()
import { registerUser, loginUser, getUser } from '../controllers/userController.js'

routerUser.post('/', registerUser)

routerUser.post('/login', loginUser)

routerUser.get('/userinfo', getUser)


// module.exports = routerUser

export default routerUser