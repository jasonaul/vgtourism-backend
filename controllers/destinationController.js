import Destinations from '../models/destinations.js'
import asyncHandler from 'express-async-handler'
import Users from '../models/users.js'

// Description: Get destinations (pre-authentication)
// @route GET /api/destinations
// @access Public
export const getDestinations = asyncHandler(async (req, res) => {
    const destinations = await Destinations.find()
    res.status(200).json(destinations)
})

// Description: Create destinations (pre-authentication)
// @route POST /api/destinations
// @access Private
// export const createDestination = asyncHandler(async (req, res) => {
//     if(!req.body.text) {
//         res.status(400)
//         throw new Error('Please add text and/or information.')
//     }
//     const destinations = await Destinations.create({
//         series: req.body.text
//     })
//     res.status(200).json(destinations)
// })

export const createDestination = (req, res) => {
    Destinations.create(req.body, req.user.id, (err, createdDestination) => {
        if(err) return res.status(404).json({error: err.message})
        return res.status(200).json(createdDestination)
    })
}
// NOTE: Late in this process, we added 'req.user.id' in the Destinations.create field above. This makes it so this route can only be hit if a user is logged in. If it starts causing issues, req.user.id is likely the problem.

// Description: Update destinations (pre-authentication)
// @route PUT /api/destinations/:id
// @access Pirvate
// export const updateDestination = asyncHandler(async (req, res) => {
//     const destination = await Destinations.findById(req.params.id)
//     if(err) return res.status(400).json({error: err.message})

//     const updatedDestination = await Destinations.findByIdAndUpdate(req.params.id, req.body, {new: true})
//     res.status(200).json(updatedDestination)
// })

export const updateDestination = (req, res) => {
    const user = Users.findById(req.user.id) // We added this during authentication process, may remove if causing issues.
        //Checeking for user below
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }
            // Make sure the logged in user matches the goal user.
    if(Destinations.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized.")
    }
        //Checking above for user
    Destinations.findByIdAndUpdate(
      req.params.id, 
      {
        $set: req.body
      }, 
      { new: true }, 
      (error, updatedDestination) => {
      if(error) return res.status(400).json({ error: error.message });
  
      return res.status(200).json(updatedDestination)
    });
  };

  

// Description: Get destinations (pre-authentication)
// @route DELETE /api/destinations/:id
// @access Public
// export const deleteDestination = asyncHandler(async (req, res) => {
//     res.status(200).json({message: `Delete destination ${req.params.id}`})
// })

export const deleteDestination = (req, res) => {
    const user = Users.findById(req.user.id) // We added this during authentication process, may remove if causing issues.
        //Checeking for user below
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }
            // Make sure the logged in user matches the goal user.
    if(Destinations.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized.")
    }
        //Checking above for user
    Destinations.findByIdAndDelete(req.params.id, (error, deletedDestination) => {
      if(!deletedDestination) return res.status(400).json({error: "Destination not found"})
      if(error) return res.status(400).json({error: error.message})
      return res.status(200).json({
        message: `Destination ${deletedDestination} deleted succesfully.`
      })
    });
  };


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