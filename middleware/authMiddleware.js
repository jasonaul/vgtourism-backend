import jwt from 'jsonwebtoken'
// import asyncHandler from 'express-async-handler'
import Users from '../models/users.js'
import HttpError from '../models/http-error.js';

const protect =  (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication has failed. Please try again')
        }
        const decodedToken = jwt.verify(token, 'secret_secrets_are_no_fun')
        req.userData = {userID: decodedToken.userID}
        next()
    } catch (err) {
        const error = new HttpError("Authentication has failed. Please try again.", 401);
        return next(error);
    }




}
export default protect