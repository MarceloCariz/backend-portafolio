import express from 'express';
import {  agregarDatos, confirmarRecepcionPedidoLocal, crearPedidoExt, crearPedidoLocal, obtenerBoleta, obtenerClientes,  obtenerPedidos,  regitrarCliente, traerDatosCliente } from '../controllers/clienteController.js';
import checkAuth from '../middleware/checkAuth.js';



const router = express.Router();

router.get('/', obtenerClientes);
router.get('/informacion/',checkAuth, traerDatosCliente);
router.get('/pedidos',checkAuth, obtenerPedidos);
router.get('/boleta/:id',obtenerBoleta);
router.post('/nuevo', regitrarCliente);
router.post('/ingresar/orden/local', checkAuth,crearPedidoLocal);
router.post('/ingresar/orden', checkAuth,crearPedidoExt);

router.put('/informacion/actualizar',checkAuth, agregarDatos);
router.put('/pedido/confirmar/:id', confirmarRecepcionPedidoLocal);
// router.post('/login', autenticar);
// router.get('/perfil',checkAuth,perfil)

export default router;