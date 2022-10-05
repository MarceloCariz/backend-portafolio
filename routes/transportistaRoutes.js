import express from 'express';
import { obtenerTransportista, registrarTransportista, perfilTransportista, traerDatos} from '../controllers/transportistaController.js';
import checkAuth from '../middleware/checkAuth.js';




const router = express.Router();

router.post('/registrar', registrarTransportista)
router.get('/', obtenerTransportista);
router.put('/informacion/actualizar',checkAuth, perfilTransportista);
router.get('/informacion/', checkAuth, traerDatos);

export default  router