import express, { Router } from 'express';
import {  editarProducto, eliminarProducto, nuevoProducto, obtenerProductores, obtenerProductos, registrarProductor } from '../controllers/productorController.js';
import checkAuth from '../middleware/checkAuth.js';
import checkAuthProductor from '../middleware/checkAuthProductor.js';



const router = express.Router();

router.get('/', obtenerProductores);
router.post('/nuevo', registrarProductor);
// router.post('/login', autenticar);
// router.get('/perfil',checkAuthProductor, perfil)
router.get('/productos',checkAuth, obtenerProductos )
router.post('/productos/nuevo',checkAuth, nuevoProducto )
router.delete('/productos/eliminar',checkAuth, eliminarProducto)
router.put('/productos/editar',checkAuth, editarProducto)




export default router;