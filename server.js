//** General Use Imports **//
import express, { application } from 'express';
import bodyParser from 'body-parser';
import HttpError from './models/http-error.js';

//**  Middleware  **//
import routerDestination from './routes/destinationRoutes.js'
import routerUser from './routes/userRoutes.js';

//** Database  **/
import mongoose from 'mongoose';

import dotenv from 'dotenv';
import { body } from 'express-validator';
dotenv.config()

const app = express();


app.use(bodyParser.urlencoded( {extended: true}))
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
  });

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
      res.json({ message: error.message || 'An unknown error has occurred.' });
    });


mongoose
    .connect(`mongodb+srv://jason:7!hc_VmXuJ2Q77@cluster0.qd4vsnj.mongodb.net/vgtourism?retryWrites=true&w=majority`
        // process.env.MONGO_URI
        )
    .then(() => {
        app.listen(5001);
    })
    .catch(err => {
        console.log(err);
    });





