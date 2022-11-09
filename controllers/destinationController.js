import Destinations from '../models/destinations.js'
import asyncHandler from 'express-async-handler'

// Description: Get destinations (pre-authentication)
// @route GET /api/destinations
// @access Public
export const getDestinations = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'Get destinations'})
})

// Description: Create destinations (pre-authentication)
// @route POST /api/destinations
// @access Private
export const createDestination = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please add information.')
    }
    res.status(200).json({message: 'Create destinations'})
})

// Description: Update destinations (pre-authentication)
// @route PUT /api/destinations/:id
// @access Pirvate
export const updateDestination = asyncHandler(async (req, res) => {
    res.status(200).json({message: `Update destination ${req.params.id}`})
})

// Description: Get destinations (pre-authentication)
// @route DELETE /api/destinations/:id
// @access Public
export const deleteDestination = asyncHandler(async (req, res) => {
    res.status(200).json({message: `Delete destination ${req.params.id}`})
})


// export const getDestination = (req, res) => {
//     res.send('This works..I think');
// }

// export const getDestination = async (req, res) => {
//    try {
//     const destinations = await Destinations.find();
//     // console.log(destinations)
//     res.status(200).json(destinations)
//    } catch (error) {
//         res.status(404).json({message: error.message})
//    }
// }



// export const createDestination = (req, res) => {
//     res.send("Destination Created");
// }