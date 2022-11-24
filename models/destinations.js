import mongoose from 'mongoose';

const destinationsSchema = mongoose.Schema({
    series: {
        type: String,
        required: false
    },
    game: {
        type: String,
        required: true
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
        required: true
    },
    experience: {
        type: Boolean,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: true
    },
    continent: {
        type: String,
        required: false
    },
    coordinates: {
        lat: {
            type: Number,
            required: false
        },
        lng: {
            type: Number,
            required: false
        }
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
    creator: {
        type: String,
        required: true
    }
});

const Destinations = mongoose.model('Destinations', destinationsSchema)

export default Destinations;