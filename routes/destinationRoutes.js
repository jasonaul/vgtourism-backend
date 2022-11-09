import express from 'express';

import {getDestination, createDestination} from '../controllers/posts.js'

const app = express()

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: 'Get destinations'})
})

router.post('/', (req, res) => {
    res.status(200).json({message: 'Create destinations'})
})

router.put('/:id', (req, res) => {
    res.status(200).json({message: `Update destination ${req.params.id}`})
})

router.delete('/:id', (req, res) => {
    res.status(200).json({message: `Delete destination ${req.params.id}`})
})



// router.get('/', getDestination);
router.post('/', createDestination);

export default router;