import express from 'express';
import { activarSubasta, registrarAdministrador } from '../controllers/adminController.js';


const router = express.Router();

router.post('/registrar', registrarAdministrador);
router.put('/subasta/activar', activarSubasta)

export default router