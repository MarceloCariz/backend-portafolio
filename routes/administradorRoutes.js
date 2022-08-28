import express from 'express';
import { registrarAdministrador } from '../controllers/adminController.js';


const router = express.Router();

router.post('/registrar', registrarAdministrador);


export default router