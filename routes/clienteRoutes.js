import express from 'express';
import {  agregarDatos, crearPedidoExt, obtenerClientes,  obtenerPedidos,  regitrarCliente, traerDatosCliente } from '../controllers/clienteController.js';
import checkAuth from '../middleware/checkAuth.js';



const router = express.Router();

router.get('/', obtenerClientes);
router.get('/informacion/',checkAuth, traerDatosCliente)
router.get('/pedidos',checkAuth, obtenerPedidos)
router.post('/nuevo', regitrarCliente);
router.post('/ingresar/orden', checkAuth,crearPedidoExt)
router.put('/informacion/actualizar',checkAuth, agregarDatos)
// router.post('/login', autenticar);
// router.get('/perfil',checkAuth,perfil)

export default router;