import express from 'express';
import protect from '../middleware/authMiddleware.js'
const app = express()

const router = express.Router();

import {getDestinations, createDestination, updateDestination, deleteDestination} from '../controllers/destinationController.js'

router.route('/').get(getDestinations).post(protect, createDestination)
    // The above line replaces the two below
    // router.get('/', getDestinations)
    // router.post('/', createDestination)

router.route('/:id').delete(protect, deleteDestination).put(protect, updateDestination)
    // The above line replaces the two below
    // router.put('/:id', updateDestination)
    // router.delete('/:id', deleteDestination)



export default router;