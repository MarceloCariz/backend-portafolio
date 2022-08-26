import express from 'express';
import {  agregarDatos, obtenerClientes,  regitrarCliente, traerDatosCliente } from '../controllers/clienteController.js';
import checkAuth from '../middleware/checkAuth.js';



const router = express.Router();

router.get('/', obtenerClientes);
router.get('/informacion/',checkAuth, traerDatosCliente)

router.post('/nuevo', regitrarCliente);
router.put('/informacion/actualizar',checkAuth, agregarDatos)
// router.post('/login', autenticar);
// router.get('/perfil',checkAuth,perfil)

export default router;