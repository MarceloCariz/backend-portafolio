import express from 'express'
import { obtenerProductos } from '../controllers/productosController.js';


const router = express.Router();


router.get('/', obtenerProductos);



export default router;