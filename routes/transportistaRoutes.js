import express from 'express';
import { registrarTransportista } from '../controllers/transportistaController.js';




const router = express.Router();

router.post('/registrar', registrarTransportista)


export default  router