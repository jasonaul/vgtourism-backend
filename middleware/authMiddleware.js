import jwt from 'jsonwebtoken'
// import asyncHandler from 'express-async-handler'
import HttpError from '../models/http-error.js';

const checkProtect =  (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
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
export default checkProtect