import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import Users from '../models/users.js'

const protect = asyncHandler(async(req, res, next) => {
    let token
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
           // Get token from header
           token = req.headers.authorization.split(' ')[1] 
           // Split turns it into an array, splitting by space, and giving us the 1-index, or just the token

           // Verify token
           const decoded = jwt.verify(token, process.env.JWT_SECRET)

           // Now, we want to get the user from the token (since the token has the user-id as a payload)
           req.user = await Users.findById(decoded.id).select('-password') //'-password' means it won't include the password

           next()
        } catch (error) {
            console.log(error)
            res.status(401) //401 = 'Not Authorized'
            throw new Error("Not authorized.")
        }
    }
    // if there is no token at all...
    if(!token) {
        res.status(401)
        throw new Error("Not Authorized. No Token.")
    }
})

// When the token is sent in the authorization header, its formatted such as 'Bearer tokenNameLetters', so we need to make sure it starts with Bearer

export default protect