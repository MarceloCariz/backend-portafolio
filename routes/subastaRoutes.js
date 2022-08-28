import express from 'express';
import { postularSubastas } from '../controllers/subastaController.js';




const router = express.Router();


router.post('/postular', postularSubastas)

export default router