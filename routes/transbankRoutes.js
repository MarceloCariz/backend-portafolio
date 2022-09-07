import express from 'express';
import { iniciarTbk, validarTbk } from '../controllers/transbankController.js';
import checkAuth from '../middleware/checkAuth.js';


const router = express.Router();

router.post('/pagar', checkAuth,iniciarTbk);
router.get('/validar/:token', validarTbk)


export default router