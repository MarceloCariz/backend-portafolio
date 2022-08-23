import express from 'express'
import { autenticarUser, perfil } from '../controllers/UsuarioController.js';
import checkAuth from '../middleware/checkAuth.js';



const router = express.Router();


router.post('/login', autenticarUser);
router.get('/perfil',checkAuth, perfil)



export default router;