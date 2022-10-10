import oracledb from "oracledb"
import conectarDB from "../config/index.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import bcrypt from 'bcrypt'
const conexion =  await conectarDB();




const registrarAdministrador= async(req,resp)=>{
    try {
        const body = req.body;
      
        // const sql = "insert into clientes (nombre) values(':nombre')" ;
        const validarUsuario = await conexion.execute( `select correo from administrador where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        // // console.log(resultado)
        if(validarUsuario.rows.length === 1){
            const error = new Error("Usuario ya registrado");
            return resp.status(400).json({ msg: error.message });
        }
        const token = generarId();
        const salt = await bcrypt.genSalt(10);
        const passwordHash =  await bcrypt.hash(body.password, salt).then(function(hash) {
            return hash
        });
        body.correo = body.correo.toLowerCase();
        const resultado = await conexion.execute( `call REGISTRARADMINISTRADOR(2,'${body.nombre}','${passwordHash}','${body.correo}')`); 
        await conexion.commit();
        resp.json({msg: "insertado correctamente"})
    } catch (error) {
        console.log(error);
        resp.json({msg: "Hubo un error"})
    }

}

const activarSubasta = async(req, resp ) =>{
    try {
        const {referencia_compra,fecha_activacion,activo} = req.body;
        const resultado = await conexion.execute(`call ACTIVARORD(${referencia_compra}, '${fecha_activacion}', '${activo}')`)
        await conexion.commit();
        resp.json({msg: "activado correctamente"})
    } catch (error) {
        console.log(error)
    }
}
// ACTIVARORD_TRANSPORTISTA
const activarSubastaTransportista = async(req, resp ) =>{
    try {
        const {referencia_compra,fecha_activacion,activo} = req.body;
        const resultado = await conexion.execute(`call ACTIVARORD_TRANSPORTISTA(${referencia_compra}, '${fecha_activacion}', '${activo}')`)
        await conexion.commit();
        resp.json({msg: "activado correctamente"})
    } catch (error) {
        console.log(error)
    }
}

//USUARIOS CRUD
///  PRODUCTOR
const eliminarProductor = async(req, resp) =>{
    try {
        const {id} = req.params;
        await conexion.execute(`call ELIMINARPRODUCTOR(${id})`)
        await conexion.commit();

        resp.json({msg: 'Eliminado Correctamente'})
    } catch (error) {
        console.log(error)
    }
}

const actualizarProductor = async(req, resp) =>{
    const {id} = req.params;
    const {nombre, correo} = req.body;
    try {
        await conexion.execute(`call EDITAR_PRODUCTOR(${id}, '${nombre}','${correo}' )`)
        await conexion.commit();

        resp.json({msg: 'Actualizado Correctamente'})
    } catch (error) {
        console.log(error)
    }
}

///  CLIENTES
const eliminarCliente= async(req, resp) =>{
    try {
        const {id} = req.params;
        await conexion.execute(`call ELIMINARCLIENTE(${id})`)
        await conexion.commit();

        resp.json({msg: 'Eliminado Correctamente'})
    } catch (error) {
        console.log(error)
    }
}
const actualizarCliente = async(req, resp) =>{
    const {id} = req.params;
    const {nombre, correo} = req.body;
    try {
        await conexion.execute(`call EDITAR_CLIENTE(${id}, '${nombre}','${correo}' )`)
        await conexion.commit();

        resp.json({msg: 'Actualizado Correctamente'})
    } catch (error) {
        console.log(error)
    }
}

////   TRANSPORTISTA
const eliminarTransportista= async(req, resp) =>{
    try {
        const {id} = req.params;
        await conexion.execute(`call ELIMINARTRANSPORTISTA(${id})`)
        await conexion.commit();

        resp.json({msg: 'Eliminado Correctamente'})
    } catch (error) {
        console.log(error)
        resp.json({msg: 'hubo un error'})
    }
}

const actualizarTransportista = async(req, resp) =>{
    const {id} = req.params;
    const {nombre, correo} = req.body;
    try {
        await conexion.execute(`call EDITAR_TRANSPORTISTA(${id}, '${nombre}','${correo}' )`)
        await conexion.commit();

        resp.json({msg: 'Actualizado Correctamente'})
    } catch (error) {
        console.log(error)
    }
}

const obtenerOrdenesCompra = async(req, resp) =>{
    try {
        const ordCompra = await conexion.execute(`select * from ord_compra`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        await conexion.commit();
        resp.json(ordCompra.rows);
    } catch (error) {
        console.log(error)
    }
}

const renovacionContrato = async(req, resp) =>{
    try {
        const {id_contrato,fecha_inicio, fecha_termino} = req.body;
        await conexion.execute(`call RENOVACION_CONTRATO(${id_contrato},'${fecha_inicio}','${fecha_termino}')`);
        await conexion.commit();
        resp.json('renovacion exitosa');
    } catch (error) {
        console.log(error)
    }
}


export {
    registrarAdministrador,
    activarSubasta,
    obtenerOrdenesCompra,

    eliminarProductor,
    actualizarProductor,

    eliminarCliente,
    actualizarCliente,


    eliminarTransportista,
    actualizarTransportista,
    activarSubastaTransportista,

    renovacionContrato
}