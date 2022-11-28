//** General Use Imports **//
import express, { application } from 'express';
import bodyParser from 'body-parser';
import HttpError from './models/http-error.js';


//**  Middleware  **//
import routerDestination from './routes/destinationRoutes.js'
import routerUser from './routes/userRoutes.js';

//** Database  **/
import mongoose from 'mongoose';

import cors from 'cors';
import colors from 'colors'

import dotenv from 'dotenv';
dotenv.config()

import errorHandler from './middleware/errorMiddleware.js'

// const whitelist = ['http://localhost:3000', 'http://localhost:5001']

// const corsOptions = {
// 	origin: (origin, callback) => {
// 		console.log(whitelist, "WHITELIST")
// 		console.log(origin, "ORIGIN")
// 		if (whitelist.indexOf(origin) !== -1 || !origin) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error('Not allowed by CORS'));
// 		}
// 	},
// 	credentials: true,
// };
// const express = require('express')
// const bodyParser = require('body-parser')



const app = express();
// app.use(cors(corsOptions))
// app.use(cors("*"))

app.use(bodyParser.json());
// app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
})

app.use('/api/destinations', routerDestination)
app.use('/api/users', routerUser)

app.use((req, res, next) => {
    const error = new HttpError('This route could not be found.', 404);
    console.log(error)
    throw error;
    
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || "I am error."})
});


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(5001);
    })
    .catch(err => {
        console.log(err);
    });





