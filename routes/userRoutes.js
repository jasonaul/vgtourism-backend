import express from 'express';
import { check } from 'express-validator'
import { userFinder, registerUser, loginUser } from '../controllers/userController.js';
// import protect from '../middleware/authMiddleware.js'
// import {getDestinations, createDestination, updateDestination, deleteDestination} from '../controllers/destinationController.js'
const app = express()

const routerDestination = express.Router();

routerDestination.get('/', userFinder);

routerDestination.post('/register', 
[
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() 
      .isEmail(),
    check('password').isLength({ min: 7 })
  ], 
  registerUser); 

routerDestination.post('/login', loginUser )




export default routerDestination
    //Exporting the 'router' constant.




