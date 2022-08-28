import express from 'express';
import { obtenerTransportista, registrarTransportista } from '../controllers/transportistaController.js';




const router = express.Router();

router.post('/registrar', registrarTransportista)
router.get('/', obtenerTransportista);

export default  router