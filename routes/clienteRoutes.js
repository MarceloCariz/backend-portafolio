import express from 'express';
import {  obtenerClientes,  regitrarCliente } from '../controllers/clienteController.js';
import checkAuth from '../middleware/checkAuth.js';



const router = express.Router();

router.get('/', obtenerClientes);
router.post('/nuevo', regitrarCliente);
// router.post('/login', autenticar);
// router.get('/perfil',checkAuth,perfil)

export default router;