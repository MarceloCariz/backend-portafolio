import express from 'express';
import { activarSubasta, actualizarCliente, actualizarProductor, actualizarTransportista, eliminarCliente, eliminarProductor, eliminarTransportista, obtenerOrdenesCompra, registrarAdministrador } from '../controllers/adminController.js';


const router = express.Router();

router.post('/registrar', registrarAdministrador);
router.put('/subasta/activar', activarSubasta)
router.get('/ordenes', obtenerOrdenesCompra);
//USUARIOS 
//PRODUCTORES
router.put('/productor/actualizar/:id', actualizarProductor);
router.delete('/productor/eliminar/:id', eliminarProductor)

//clientes
router.put('/cliente/actualizar/:id', actualizarCliente);
router.delete('/cliente/eliminar/:id', eliminarCliente);

//transportista
router.put('/transportista/actualizar/:id',actualizarTransportista);
router.delete('/transportista/eliminar/:id', eliminarTransportista);
export default router