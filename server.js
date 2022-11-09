import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';

dotenv.config()

const app = express();

app.use('/posts', postRoutes);
    // Every route within the posts routes will start with posts

app.use(bodyParser.json({limit: "50mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(cors());

// const mongoose = require('mongoose');
// mongoose.connect(connectionStr);
// https://www.mongodb.com/cloud/atlas 

// const CONNECTION_URL = process.env.MONGODB_URI;

const CONNECTION_URL = 'mongodb+srv://jason:7!hc_VmXuJ2Q77@cluster0.qd4vsnj.mongodb.net/?retryWrites=true&w=majority'


// process.env.MONGODB_URI
const PORT = process.env.PORT ||  8080;


app.listen( PORT, () => {
    console.log("Server is listening on " + PORT )
})

// mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
//     .then(() => )
//     .catch(() => )

// mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
//     .then(() => app.listen([PORT, () => console.log(`Server running on port: ${PORT}`)]))
//     .catch((error) => console.log(error.message))

// set up listeners to monitor your database connection
// mongoose.connection.on('connected', ()=> console.log('DB connected...'));

// mongoose.connection.on('error', (err)=> console.log(err.message));

// mongoose.connection.on('disconnected', ()=> console.log('mongoose disconnected'));

