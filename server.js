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

const whitelist = ['http://localhost:3000', 'http://localhost:8080']

const corsOptions = {
	origin: (origin, callback) => {
		console.log(whitelist, "WHITELIST")
		console.log(origin, "ORIGIN")
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
};
// const express = require('express')
// const bodyParser = require('body-parser')



const app = express();
app.use(cors(corsOptions))

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  
    next();
})

app.use('/api/destinations', routerDestination)
app.use('/api/users', routerUser)

app.use((req, res, next) => {
    const error = new HttpError('You cannot progress any further.', 404);
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
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });










// connectDB()
// //-----//


// const app = express();

// app.use(express.json())
// app.use(express.urlencoded({extended: false}))

// app.use('/api/destinations', router);
//     // Every route within the posts routes will start with posts
// app.use('/api/users', routerUser);

// app.use(errorHandler)

// // app.use(bodyParser.json({limit: "50mb", extended: true}));
// // app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
// // app.use(cors());

// // const mongoose = require('mongoose');
// // mongoose.connect(connectionStr);
// // https://www.mongodb.com/cloud/atlas 

// // const CONNECTION_URL = process.env.MONGODB_URI;

// const CONNECTION_URL = 'mongodb+srv://jason:7!hc_VmXuJ2Q77@cluster0.qd4vsnj.mongodb.net/?retryWrites=true&w=majority'


// // process.env.MONGODB_URI
// const PORT = process.env.PORT ||  8080;


// app.listen( PORT, () => {
//     console.log("Server is listening on " + PORT )
// })

// // mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
// //     .then(() => )
// //     .catch(() => )

// // mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
// //     .then(() => app.listen([PORT, () => console.log(`Server running on port: ${PORT}`)]))
// //     .catch((error) => console.log(error.message))

// // set up listeners to monitor your database connection
// // mongoose.connection.on('connected', ()=> console.log('DB connected...'));

// // mongoose.connection.on('error', (err)=> console.log(err.message));

// // mongoose.connection.on('disconnected', ()=> console.log('mongoose disconnected'));

