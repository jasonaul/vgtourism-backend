import express from 'express';

import {getDestination, createDestination} from '../controllers/posts.js'

const app = express()

const router = express.Router();

// router.get('/', (req, res) => {
//     res.send('This works...?');
// });

router.get('/', getDestination);
router.post('/', createDestination);

export default router;