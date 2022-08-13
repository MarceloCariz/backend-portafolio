import express, { Router } from 'express';
import { autenticar, nuevoProducto, obtenerProductores, obtenerProductos, perfil, registrarProductor } from '../controllers/productorController.js';
import checkAuth from '../middleware/checkAuth.js';
import checkAuthProductor from '../middleware/checkAuthProductor.js';



const router = express.Router();

router.get('/', obtenerProductores);
router.post('/nuevo', registrarProductor);
router.post('/login', autenticar);
router.get('/perfil',checkAuthProductor, perfil)
router.get('/productos',checkAuthProductor, obtenerProductos )
router.post('/productos/nuevo',checkAuthProductor, nuevoProducto )


export default router;