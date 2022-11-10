import express from 'express';
const routerUser = express.Router()
import { registerUser, loginUser, getUser } from '../controllers/userController.js'
import protect from '../middleware/authMiddleware.js'


routerUser.post('/', registerUser)

routerUser.post('/login', loginUser)

routerUser.get('/userinfo', protect, getUser)


// module.exports = routerUser

export default routerUser