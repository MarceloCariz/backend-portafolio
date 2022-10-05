import express from 'express';
import { obtenerPerfil, obtenerSubastasActivas, obtenerTransportista, registrarTransportista } from '../controllers/transportistaController.js';
import checkAuth from '../middleware/checkAuth.js';




const router = express.Router();

router.post('/registrar', registrarTransportista)
router.get('/', obtenerTransportista);
router.get('/subastas',obtenerSubastasActivas);
router.get('/perfil',checkAuth,obtenerPerfil)

export default  router