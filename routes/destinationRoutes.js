import express from 'express';
import { createDestination, getDestByID, getDestByUser, updateDestination, deleteDestination } from '../controllers/destinationController.js';
import protect from '../middleware/authMiddleware.js'
// import {getDestinations, createDestination, updateDestination, deleteDestination} from '../controllers/destinationController.js'
const app = express()

const routerDestination = express.Router();





routerDestination.get('/:destID', getDestByID);

routerDestination.get('/user/:userID', getDestByUser) 

routerDestination.post('/', createDestination)

routerDestination.patch('/:destID', updateDestination ); 

routerDestination.delete('/:destID', deleteDestination ); 

// routerDestination.get('/gameseries/mario'), (req, res, next) => {
//     const mario = req.params.series;
//     const destination = DUMMY_DESTINATIONS.find(d => {
//         return d.series === mario;
//     });

//     res.json([destination])
// }





export default routerDestination
    //Exporting the 'router' constant.





// router.route('/').get(getDestinations).post(protect, createDestination)
//     // The above line replaces the two below
//     // router.get('/', getDestinations)
//     // router.post('/', createDestination)

// router.route('/:id').delete(protect, deleteDestination).put(protect, updateDestination)
//     // The above line replaces the two below
//     // router.put('/:id', updateDestination)
//     // router.delete('/:id', deleteDestination)



// export default router;