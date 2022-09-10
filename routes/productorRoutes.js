import express, { Router } from 'express';
import {  editarProducto, eliminarProducto, nuevoProducto, obtenerEnvios, obtenerProductores, obtenerProductos, obtenerSubastasActivas, registrarProductor } from '../controllers/productorController.js';
import checkAuth from '../middleware/checkAuth.js';
import checkAuthProductor from '../middleware/checkAuthProductor.js';



const router = express.Router();

router.get('/', obtenerProductores);
// router.post('/login', autenticar);
// router.get('/perfil',checkAuthProductor, perfil)
router.get('/subastas', obtenerSubastasActivas);
router.get('/productos',checkAuth, obtenerProductos )
router.get('/envios',checkAuth, obtenerEnvios);
router.post('/productos/nuevo',checkAuth, nuevoProducto )
router.post('/nuevo', registrarProductor);
router.delete('/productos/eliminar/:idp',checkAuth, eliminarProducto)
router.put('/productos/editar',checkAuth, editarProducto)




export default router;