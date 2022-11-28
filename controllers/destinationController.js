import HttpError from '../models/http-error.js'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import Destinations from '../models/destinations.js'
import Users from '../models/users.js'
import mongoose from 'mongoose'


export const getDestByID = async (req, res, next) => {
    const destID = req.params.destID;
    let destination;
    try {
        destination = await Destinations.findById(destID);

    } catch (err) {
        const error = new HttpError("Hmm, we couldn't find the destination you are looking for. Try again!", 500);

        return next(error);
    }

    if (!destination) {
        const error = new HttpError('I am error.', 404);
        return next(error)
         }

    res.json({destination: destination.toObject( {getters: true} ) })
}

export const getDestByUser = async (req, res, next) => {
    const userID = req.params.userID;
    // let destinations
    let aUsersDestinations;
    try {
         aUsersDestinations = await Users.findById(userID).populate('destinations') 
    } catch (err) {
        const error = new HttpError("Cannot find the user/destination you are looking for.", 500);
        return next(error)
    }
    if (!aUsersDestinations || aUsersDestinations.destinations.length === 0 ){
        return next(
            new HttpError('I am error...userID', 404)
       
       )
    }

    res.json({destinations: aUsersDestinations.destinations.map(destination => destination.toObject({getters:true}))})
}

export const getBySeries = (req, res, next) => {
    const series = req.params.series;
    const gameSeries = Destinations.filter(d => {
        return d.series === series;
    });

    if (!gameSeries || gameSeries.length === 0){
        
        return next(
            new HttpError('I am error...userID', 404)
       
       )
    }
    res.json({gameSeries})
}

export const createDestination = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }

    // const { destinationName, experience, series, game, console, releaseyear, city, state, country, continent, coordinates, headline, description1, description2, description3, image1, image2, image3, ingameimg1, ingameimg2, ingameimg3 } = req.body;

    const { destinationName, series, game, city, country, headline } = req.body;

    const createdDestination = new Destinations({
        destinationName,
        experience,
        series, 
        game,
        console,
        coordinates,
        releaseyear,
        city,
        state,
        country,
        continent,
        headline,
        description1,
        description2,
        description3,
        image1,
        image2,
        image3,
        ingameimg1, 
        ingameimg2,
        ingameimg3,
        creator: req.userData.userID
    });

    let user;
    try {
        user = await Users.findById(req.userData.userID);
    } catch (err) {
        const error = new HttpError("Creating a destination failed. Please try again.", 500);
        return next(error)
    }

    if (!user) {
        const error = new HttpError("User not found. Please try again.", 404)
        return next (error);
    }


    try {
        const currentSession = await mongoose.startSession();
        currentSession.startTransaction();
        await createdDestination.save({ session: currentSession });
        user.destinations.push(createdDestination);
        await user.save({ session: currentSession });
        await currentSession.commitTransaction();

      } catch (err) {
          const error = new HttpError(
          "Creating a destination has failed, please try again.",
          500
        );
        return next(error);
      }
    

    // DUMMY_DESTINATIONS.push(createdDestination);
        // Only need in dev mode.

    res.status(201).json({destination: createdDestination})
};


export const updateDestination = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next (
            new HttpError('Several fields required for you to update. Please check your data.', 422)
        ) 
    }

  const { destinationName, headline, game} = req.body;
  const destID = req.params.destID

//   const destID = req.params.destID
//   const updatedDestination = {...DUMMY_DESTINATIONS.find(d => d.id === destID)};  
//   const destinationIndex = DUMMY_DESTINATIONS.findIndex(d => d.id === destID);
    //Save for developer purposes. Just in case.

let destination;
try {
    destination = await Destinations.findById(destID)
} catch (err) {
    const error = new HttpError("Updating went haywire. Please try again.", 500);
    return next(error);
    
}

if (destination.creator.toString() != req.userData.userID) {
    const error = new HttpError("Only the user who created this destination may edit itt or delete it.",
    401);
    return next(error)
}


destination.destinationName = destinationName;
destination.headline = headline;
destination.game = game;

try {
    await destination.save();
} catch (err) {
    const error = new HttpError("Something not-good happened. Couldn't update the destination. Please try again.", 500);
    return next(error)
}
  
//   DUMMY_DESTINATIONS[destinationIndex] = updatedDestination;
    //Saving dummy options for any debugging that may be needed.

  res.status(200).json({destination: destination.toObject({getters: true})})
};

export const deleteDestination = async (req, res, next) => {
    const destID = req.params.destID

    let destination;
    try {
        destination = await Destinations.findById(destID).populate('creator');
    } catch (err) {
        const error = new HttpError("Deleting didn't work for some reason. Try again.", 500)
        return next(error);
    }

    if (!destination) {
        const error = new HttpError("Destination not found. Please try again.", 404);
        return next(error);
    }

    try {
        const currentSession = await mongoose.startSession();
        currentSession.startTransaction();
        await destination.remove({session: currentSession});
        destination.creator.destinations.pull(destination);
        await destination.creator.save({session: currentSession});
        await currentSession.commitTransaction();
    } catch (err) {
        const error = new HttpError("Deleting didn't work for some reason. Try again.", 500);
        return next(error);
    }

    // DUMMY_DESTINATIONS = DUMMY_DESTINATIONS.filter(d => d.id !== destID);
        // Saving dummy code for debugging.

    res.status(200).json({message: 'Destination Deleted!'})
};


// import asyncHandler from 'express-async-handler'
// import Users from '../models/users.js'


// let DUMMY_DESTINATIONS = [
//     {
//         id: 'd1',
//         destinationName: 'Ezio\'s Playhouse',
//         description: 'A really famous building.',
//         image: 'https://workleavebalance.files.wordpress.com/2014/07/dscf0725.jpg',
//         address: 'Florence, Italy',
//         coordinates: {
//             lat: 40.7484405,
//             lng: -73.9878584
//         },
//         creator: 'u1'
//     },
//     {
//         id: 'd2',
//         title: 'Hong Kong in Sleeping Dogs',
//         description: 'A city.',
//         image: 'https://i.imgur.com/https://coolmaterial.com/wp-content/uploads/2018/11/Hong-Kong-647x441.jpg.jpeg',
//         address: 'Hong Kong',
//         coordinates: {
//             lat: 40.7484405,
//             lng: -73.9878584
//         },
//         creator: 'u2'
//     },
//     {
//         id: 'd3',
//         title: 'THE STATIEST Empire State Building',
//         description: 'A really famous building.',
//         image: 'https://i.imgur.com/KnSikdp.jpeg',
//         address: '20 W 34th St, New York, NY 10001',
//         coordinates: {
//             lat: 40.7484405,
//             lng: -73.9878584
//         },
//         creator: 'u2'
//     },
//     {
//         id: 'd4',
        // series: 'Mario',
        // game: 'Super Mario 64',
        // console: 'Nintendo 64',
        // releaseyear: 1996,
        // destinationName: 'Shibam, Yemen',
        // experience: 'Destination',
        // city: 'Shibam',
        // state: '',
        // country: 'Yemen',
        // continent: 'Asia',
        // coordinates: {
        //     lat: 15.9176648,
        //     lng: 48.6235893,
        // },
        // latitude: '15.9176648',
        // longitude: '48.6235893',
        // creator: 'u3',
        // externalsite: '',
        // headline: 'Background Inspiration for Wet-Dry World.',
        // description1: 'Dummy description data. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        // description2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        // description3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        // image1: 'https://hiddenarchitecture.net/wp-content/uploads/2016/01/shibam_01-1.jpg',
        // image2: 'https://hiddenarchitecture.net/wp-content/uploads/2016/01/shibam_01-1.jpg',
        // image3: 'https://hiddenarchitecture.net/wp-content/uploads/2016/01/shibam_01-1.jpg',
        // ingameimg1: 'https://preview.redd.it/v6gfeuoz3ou51.jpg?width=960&crop=smart&auto=webp&s=6f3539668a3fc55bcd9fffb228256780308e3230',
        // ingameimg2: 'https://preview.redd.it/v6gfeuoz3ou51.jpg?width=960&crop=smart&auto=webp&s=6f3539668a3fc55bcd9fffb228256780308e3230',
        // ingameimg3: 'https://preview.redd.it/v6gfeuoz3ou51.jpg?width=960&crop=smart&auto=webp&s=6f3539668a3fc55bcd9fffb228256780308e3230',
//     },
//     {
//         id: 'd5',
//         destinationName: 'Ezio\'s Playhouse',
//         description: 'A really famous building.',
//         series: 'Mario',
//         image: 'https://workleavebalance.files.wordpress.com/2014/07/dscf0725.jpg',
//         address: 'Florence, Italy',
//         coordinates: {
//             lat: 40.7484405,
//             lng: -73.9878584
//         },
//         creator: 'u1'
//     },
// ]













// // Description: Get destinations (pre-authentication)
// // @route GET /api/destinations
// // @access Public
// export const getDestinations = asyncHandler(async (req, res) => {
//     const destinations = await Destinations.find()
//     res.status(200).json(destinations)
// })

// // Description: Create destinations (pre-authentication)
// // @route POST /api/destinations
// // @access Private
// // export const createDestination = asyncHandler(async (req, res) => {
// //     if(!req.body.text) {
// //         res.status(400)
// //         throw new Error('Please add text and/or information.')
// //     }
// //     const destinations = await Destinations.create({
// //         series: req.body.text
// //     })
// //     res.status(200).json(destinations)
// // })

// export const createDestination = (req, res) => {
//     Destinations.create(req.body, req.user.id, (err, createdDestination) => {
//         if(err) return res.status(404).json({error: err.message})
//         return res.status(200).json(createdDestination)
//     })
// }
// // NOTE: Late in this process, we added 'req.user.id' in the Destinations.create field above. This makes it so this route can only be hit if a user is logged in. If it starts causing issues, req.user.id is likely the problem.

// // Description: Update destinations (pre-authentication)
// // @route PUT /api/destinations/:id
// // @access Pirvate
// // export const updateDestination = asyncHandler(async (req, res) => {
// //     const destination = await Destinations.findById(req.params.id)
// //     if(err) return res.status(400).json({error: err.message})

// //     const updatedDestination = await Destinations.findByIdAndUpdate(req.params.id, req.body, {new: true})
// //     res.status(200).json(updatedDestination)
// // })

// export const updateDestination = (req, res) => {
//     const user = Users.findById(req.user.id) // We added this during authentication process, may remove if causing issues.
//         //Checeking for user below
//     if(!user) {
//         res.status(401)
//         throw new Error('User not found')
//     }
//             // Make sure the logged in user matches the goal user.
//     if(Destinations.user.toString() !== user.id) {
//         res.status(401)
//         throw new Error("User not authorized.")
//     }
//         //Checking above for user
//     Destinations.findByIdAndUpdate(
//       req.params.id, 
//       {
//         $set: req.body
//       }, 
//       { new: true }, 
//       (error, updatedDestination) => {
//       if(error) return res.status(400).json({ error: error.message });
  
//       return res.status(200).json(updatedDestination)
//     });
//   };

  

// // Description: Get destinations (pre-authentication)
// // @route DELETE /api/destinations/:id
// // @access Public
// // export const deleteDestination = asyncHandler(async (req, res) => {
// //     res.status(200).json({message: `Delete destination ${req.params.id}`})
// // })

// export const deleteDestination = (req, res) => {
//     const user = Users.findById(req.user.id) // We added this during authentication process, may remove if causing issues.
//         //Checeking for user below
//     if(!user) {
//         res.status(401)
//         throw new Error('User not found')
//     }
//             // Make sure the logged in user matches the goal user.
//     if(Destinations.user.toString() !== user.id) {
//         res.status(401)
//         throw new Error("User not authorized.")
//     }
//         //Checking above for user
//     Destinations.findByIdAndDelete(req.params.id, (error, deletedDestination) => {
//       if(!deletedDestination) return res.status(400).json({error: "Destination not found"})
//       if(error) return res.status(400).json({error: error.message})
//       return res.status(200).json({
//         message: `Destination ${deletedDestination} deleted succesfully.`
//       })
//     });
//   };


// // export const getDestination = (req, res) => {
// //     res.send('This works..I think');
// // }

// // export const getDestination = async (req, res) => {
// //    try {
// //     const destinations = await Destinations.find();
// //     // console.log(destinations)
// //     res.status(200).json(destinations)
// //    } catch (error) {
// //         res.status(404).json({message: error.message})
// //    }
// // }



// // export const createDestination = (req, res) => {
// //     res.send("Destination Created");
// // }