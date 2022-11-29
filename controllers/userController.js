import Users from '../models/users.js'
import HttpError from '../models/http-error.js'
import { validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import mongoose from 'mongoose'
import Destinations from '../models/destinations.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



export const userFinder = async (req, res, next) => {
    // res.json({users: DUMMY_USERS})
        //Saving in case needed for debugging.
    let users
    try {
        users = await Users.find({}, '-password')   
    } catch (err) {
        const error = new HttpError("Finding users failed. Please try again.", 500);
        return next(error)
    }
    res.json({users: users.map(user => user.toObject({getters:true})
        )})
}

export const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(
         new HttpError("You must use a name (of your preference), an email address, and a password (minimum 7 characters).", 422)
    )}
    const { name, email, password } = req.body;

    let alreadyRegistered;
    try {
        alreadyRegistered = await Users.findOne({ email: email })
    } catch (err) {
        const error = new HttpError("An error occurred with registering. Please try again.", 500)
        return next(error)
    }

    if (alreadyRegistered) {
        const error = new HttpError("A user with this email address already exists!", 422)
        return next (error)
    }

    // const alreadyRegistered = DUMMY_USERS.find(u => u.email === email);
    // if (alreadyRegistered) {
    //     throw new HttpError("Cannot create new user - email already in use.", 422)
    // }
        //Save for any debugging needs.
    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 12);

    } catch (err) {
        const error = new HttpError('Could not create user. A password hashing error has occurred.', 500);
        return next(error)
    }

    const registeredUser = new Users({
        name,
        email,
        image: 'https://w7.pngwing.com/pngs/717/24/png-transparent-computer-icons-user-profile-user-account-avatar-heroes-silhouette-black-thumbnail.png',
        password: hashedPassword,
        destinations: []
    });

    // DUMMY_USERS.push(registeredUser);
        //Again for debugging away from database

    try {
        await registeredUser.save();
    } catch (err) {
        const error = new HttpError("Something not-good happened. Couldn't register this user. Please try again.", 500);
        return next(error)
    }

    let token;
    try {
        token = jwt.sign({
            userID: registeredUser.id,
            email: registeredUser.email
        },
            'secret_secrets_are_no_fun', 
            {expiresIn: '2h'}
        );
    } catch (err) {
        const error = new HttpError("Something not-good happened. Couldn't register this user. Please try again.", 500);
        return next(error)
    }


    res.status(201).json({
        userID: registeredUser.id,
        email: registeredUser.email,
        token: token
    });

    console.log(registeredUser.id, registeredUser.email)
};

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    let alreadyRegistered;
    try {
        alreadyRegistered = await Users.findOne({ email: email })
    } catch (err) {
        const error = new HttpError("An error occurred with logging in. Please try again.", 500)
        return next(error)
    }




    if (!alreadyRegistered) {
        const error = new HttpError(
            'Invalid email address or password.', 401
        );
        return next(error)
    }

    let validPassword = false;
    try {
        validPassword = await bcrypt.compare(password, alreadyRegistered.password)
    } catch (err) {
        const error = new HttpError('Login failed. Please check your email address or password and try again.');
        return next(error);
    }

    if (!validPassword) {
        const error = new HttpError(
            'Invalid email address or password.', 401
        );
        return next(error)
    }

    let token;
    try {
        token = jwt.sign({
            userID: alreadyRegistered.id,
            email: alreadyRegistered.email
        },
            'secret_secrets_are_no_fun', 
            {expiresIn: '2h'}
        );
    } catch (err) {
        const error = new HttpError("Something not-good happened. Couldn't login this user. Please try again.", 500);
        return next(error)
    }
  
    res.json({
        userID: alreadyRegistered.id,
        email: alreadyRegistered.email,
        token: token
  });
    
}



// import jwt from 'jsonwebtoken'

// import asyncHandler from 'express-async-handler'
// import Users from '../models/users.js'


// // Registers new user
// // @ route POST /api/users
// // @access Public (must be public to register first...)
// const registerUser = asyncHandler(async(req, res) => {
//     const { name, email, password } = req.body

//     if(!name || !email || !password) {
//         res.status(400)
//         throw new Error('A name, email, and password is required.')
//     }

//     // Checek if user already exists
//     const userExists = await Users.findOne({email})

//     if(userExists) {
//         res.status(400)
//         throw new Error('A user already exists for this email address.')
//     }

//     // Using bcrypt to hash the password and make it secure

//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     // Creating the user
//     const user = await Users.create({
//         name,
//         email,
//         password: hashedPassword
//     })

//     if(user) {
//         res.status(201).json({
//             _id: user.id,
//             name: user.name,
//             email: user.email,
//             token: generateToken(user._id)
//         })
//     } else {
//         res.status(400)
//         throw new Error('Invalid user data presented.')
//     }

//     // res.json({message: "Register User"})
// })

// // Login/Authenticate a user
// // @ route POST /api/users/login
// // @access Public (must be public to register first...)
// const loginUser = asyncHandler(async(req, res) => {
//     const {email, password} = req.body
//     //Checking for user email
//     const user = await Users.findOne({email})

//     //Checking for password
//     if (user && (await bcrypt.compare(password, user.password))) {
//         res.json({
//             _id: user.id,
//             name: user.name,
//             email: user.email,
//             token: generateToken(user._id)
//         })
//     } else {
//         res.status(400)
//         throw new Error('Invalid email and/or password.')
//     }

//     res.json({message: "User logged in"})
// })

// // Get a user's data
// // @ route GET /api/users
// // @access Private
// const getUser = asyncHandler(async(req, res) => {
//     // res.json({message: "User data retrieved and displayed"})
//     // const {_id, name, email} = await Users.findById(req.user.id) // don't really need this, since we got the user from the middleware, but leaving it in shouldn't cause any issues...

//     res.status(200).json(req.user)

//     // res.status(200).json({
//     //     id: _id,
//     //     name,
//     //     email
//     // }) // not needed currently
// })

// // Generate JWT
//     //This will sign the new token with the ID we have passed in, with the JWT_SECRET used, and it will expire in 30 days.
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: '30d'
//     })
// }

// // module.exports = registerUser

// export {registerUser, loginUser, getUser} 


// const  DUMMY_USERS = [
//     {
//         id: 'u1',
//         name: 'Jason Aul',
//         email: 'test@test.com',
//         password: 'testers'
//     }
// ]


  
    // const foundUser = DUMMY_USERS.find(u => u.email === email);
    // if (!foundUser || foundUser.password !== password) {
    //   throw new HttpError('Email or password is incorrect.', 401);
    // }
        // Save for debugging.