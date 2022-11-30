import express from 'express';
import { activarSubasta, activarSubastaTransportista, actualizarCliente, actualizarProductor, actualizarTransportista, agregarNombreProducto, datosGraficos, editarNombreProducto, eliminarCliente, eliminarNombreProducto, eliminarProductoProductor, eliminarProductor, eliminarTransportista, generarRepote, listarReportes, obtenerContratos, obtenerOrdenesCompra, registrarAdministrador, registrarConsultor, renovacionContrato } from '../controllers/adminController.js';


const router = express.Router();

router.post('/registrar', registrarAdministrador);
router.put('/subasta/activar', activarSubasta)
router.get('/ordenes', obtenerOrdenesCompra);
//USUARIOS 
router.post('/registrar/consultor', registrarConsultor);
//PRODUCTORES
router.put('/productor/actualizar/:id', actualizarProductor);
router.delete('/productor/eliminar/:id', eliminarProductor)

//clientes
router.put('/cliente/actualizar/:id', actualizarCliente);
router.delete('/cliente/eliminar/:id', eliminarCliente);

//transportista
router.put('/transportista/actualizar/:id',actualizarTransportista);
router.delete('/transportista/eliminar/:id', eliminarTransportista);
router.put('/subasta/transportista/activar', activarSubastaTransportista);

// contrato
router.get('/contratos', obtenerContratos);
router.put('/productor/contrato/renovacion', renovacionContrato);

//GRAFICOS
router.get('/envios/graficos/datos', datosGraficos);
//REPORTES
router.post('/envios/reporte', generarRepote);
router.get('/envios/reporte/listar', listarReportes);
// NOMBRE PRODUCTO
router.post('/producto/nuevo',agregarNombreProducto);
router.delete('/producto/nombre/eliminar/:id', eliminarNombreProducto);
router.put('/producto/nombre/editar', editarNombreProducto);

router.delete('/producto/productor/eliminar/:id', eliminarProductoProductor);
export default router