import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import Users from '../models/users.js'


// Registers new user
// @ route POST /api/users
// @access Public (must be public to register first...)
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body

    if(!name || !email || !password) {
        res.status(400)
        throw new Error('A name, email, and password is required.')
    }

    // Checek if user already exists
    const userExists = await Users.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error('A user already exists for this email address.')
    }

    // Using bcrypt to hash the password and make it secure

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Creating the user
    const user = await Users.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data presented.')
    }

    // res.json({message: "Register User"})
})

// Login/Authenticate a user
// @ route POST /api/users/login
// @access Public (must be public to register first...)
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    //Checking for user email
    const user = await Users.findOne({email})

    //Checking for password
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid email and/or password.')
    }

    res.json({message: "User logged in"})
})

// Get a user's data
// @ route GET /api/users
// @access Private
const getUser = asyncHandler(async(req, res) => {
    // res.json({message: "User data retrieved and displayed"})
    const {_id, name, email} = await Users.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email
    })
})

// Generate JWT
    //This will sign the new token with the ID we have passed in, with the JWT_SECRET used, and it will expire in 30 days.
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// module.exports = registerUser

export {registerUser, loginUser, getUser}