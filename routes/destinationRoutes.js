import express from 'express';

const app = express()

const router = express.Router();

import {getDestinations, createDestination, updateDestination, deleteDestination} from '../controllers/destinationController.js'

router.route('/').get(getDestinations).post(createDestination)
    // The above line replaces the two below
    // router.get('/', getDestinations)
    // router.post('/', createDestination)

router.route('/:id').delete(deleteDestination).put(updateDestination)
    // The above line replaces the two below
    // router.put('/:id', updateDestination)
    // router.delete('/:id', deleteDestination)



export default router;