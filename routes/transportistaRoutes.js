import express from 'express';

import { obtenerPerfil, obtenerSubastasActivas, obtenerTransportista, registrarTransportista, perfilTransportista, traerDatos, obtenerEnvios, confirmarPedidoenviado} from '../controllers/transportistaController.js';
import checkAuth from '../middleware/checkAuth.js';




const router = express.Router();

router.post('/registrar', registrarTransportista)
router.get('/', obtenerTransportista);
router.put('/informacion/actualizar',checkAuth, perfilTransportista);
router.get('/informacion/', checkAuth, traerDatos);
router.get('/subastas',obtenerSubastasActivas);
router.get('/perfil',checkAuth,obtenerPerfil);
router.get('/envios', checkAuth, obtenerEnvios);
router.put('/envios/enviado/confirmar', checkAuth, confirmarPedidoenviado);

export default  router