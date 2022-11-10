// You'll need to add your imports and exports, but leaving it out for now since we don't yet need this model.


import mongoose from 'mongoose';

const itinerarySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    series: {
        type: String,
        required: false
    },
    game: {
        type: String,
        required: false
    },
    console: {
        type: Array,
        required: false
    },
    releaseyear: {
        type: Number,
        required: false
    },
    destinationName: {
        type: String,
        required: false
    },
    experience: {
        type: Boolean,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    continent: {
        type: String,
        required: false
    },
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: String,
        required: false
    },
    externalSite: {
        type: String,
        required: false
    },
    headline: {
        type: String,
        required: false
    },
    description1: {
        type: String,
        required: false
    },
    description2: {
        type: String,
        required: false
    },
    description3: {
        type: String,
        required: false
    },
    image1: {
        type: String,
        required: false
    },
    image2: {
        type: String,
        required: false
    },
    image3: {
        type: String,
        required: false
    },
    ingameimg1: {
        type: String,
        required: false
    },
    ingameimg2: {
        type: String,
        required: false
    },
    ingameimg3: {
        type: String,
        required: false
    },
    //consider having date as an  ISO 8601 formatted string (“2020-07-29T07:55:55.485Z”)
    date: {
        type: String,
        required: false
    }
});

