import express from 'express'
import { perfil } from '../controllers/clienteController.js';
import { autenticarUser } from '../controllers/UsuarioController.js';
import checkAuth from '../middleware/checkAuth.js';



const router = express.Router();


router.post('/login', autenticarUser);
router.get('/perfil',checkAuth, perfil)



export default router;