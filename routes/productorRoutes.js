import express, { Router } from 'express';
import {  confirmarEnviobodega, editarProducto, eliminarProducto, nuevoProducto, obtenerContrato, obtenerEnvios, obtenerProductores, obtenerProductos, obtenerSubastasActivas, registrarProductor } from '../controllers/productorController.js';
import checkAuth from '../middleware/checkAuth.js';
import checkAuthProductor from '../middleware/checkAuthProductor.js';



const router = express.Router();

router.get('/', obtenerProductores);
// router.post('/login', autenticar);
// router.get('/perfil',checkAuthProductor, perfil)
router.get('/subastas', obtenerSubastasActivas);
router.get('/productos',checkAuth, obtenerProductos )
router.get('/envios',checkAuth, obtenerEnvios);
router.get('/contrato', checkAuth, obtenerContrato);
router.post('/productos/nuevo',checkAuth, nuevoProducto )
router.post('/nuevo', registrarProductor);
router.delete('/productos/eliminar/:idp',checkAuth, eliminarProducto)
router.put('/productos/editar',checkAuth, editarProducto)
router.put('/envios/bodega/confirmar', checkAuth, confirmarEnviobodega);



export default router;