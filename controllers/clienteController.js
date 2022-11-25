import oracledb from "oracledb"
import conectarDB from "../config/index.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import bcrypt from 'bcrypt'
const conexion =  await conectarDB();
const saltRounds = 10;

const obtenerClientes = async( req, resp) =>{

    try {
        const sql = "SELECT * FROM CLIENTE";
        const resultado =  await conexion.execute(sql,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        // // const rs= await resultado.resultSet.getRow()
        // // console.log(await rs.NOMBRE)
        
        // console.log(resultado.rows[0])
        resp.json(resultado.rows)
    } catch (error) {
        console.log(error)
    }

} 

const regitrarCliente = async(req,resp)=>{
    try {
        const body = req.body;
        // console.log(body)
        // return;
        // const sql = "insert into clientes (nombre) values(':nombre')" ;
        body.correo = body.correo.toLowerCase();
        const validarUsuario = await conexion.execute( `select correo from cliente where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
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
        const resultado = await conexion.execute( `CALL REGISTRARCLIENTE('${body.nombre}','${passwordHash}','${body.correo}', '${body.tipo}', '${body.rut}')`); 
        await conexion.commit();
        resp.json({msg: "insertado correctamente"})
    } catch (error) {
        console.log(error);
        resp.json({msg: "Hubo un error"})
    }

}

const autenticar = async (req,resp) =>{
    try {
        const body = req.body;
        const correo = await conexion.execute( `select correo from clientes where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        if(correo.rows.length === 0){
            const error = new Error("Contraseña o correo incorrectos");
            return resp.status(400).json({ msg: error.message });
        }
        const contrasena = await conexion.execute( `select contrasena from clientes where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        // const sql = "insert into clientes (nombre) values(':nombre')" ;
        const validacionContrasena = await bcrypt.compare( body.password, contrasena.rows[0].CONTRASENA);

        if(!validacionContrasena){
            const error = new Error("Contraseña o correo incorrectos");
            return resp.status(400).json({ msg: error.message });
        }
        const validarUsuario = await conexion.execute( `select * from clientes where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});

        const {ID, NOMBRE, TOKEN} = validarUsuario.rows[0];
        resp.json({msg: "Sesion valida",nombre: NOMBRE , token: generarJWT(ID)})
    } catch (error) {
        console.log(error);
        resp.json({msg: "Hubo un error"})
    }
}
// const perfil = async(req, resp) =>{
//     const { usuario } = req;
//     resp.json(usuario);
//     // console.log('sadsad')
// }
const traerDatosCliente = async(req, resp) =>{
    try {
        const {ID} = req.usuario;
        const resultado = await conexion.execute(`select direccion, ciudad, pais from cliente where id = ${ID}`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT})
        resp.json(resultado.rows[0])
    } catch (error) {
        console.log(error)
    }
}
const agregarDatos = async (req, resp) =>{
    try {
        const body = req.body;
        const {ID} = req.usuario;

        const informacion = await conexion.execute( `CALL PERFILCLIENTE(${ID}, '${body.direccion}', '${body.ciudad}', '${body.pais}')`);
        await conexion.commit();
        resp.json({msg: "Informacion actualizada"})
    } catch (error) {
        console.log(error)
    }
   
}


const crearPedidoExt = async(req, resp) =>{
    const {ID, TIPO_CLIENTE} = req.usuario;

    const body = req.body;

    // console.log(body)
    // , referencia_compra
    // const id_referencia = Math.floor(Math.random() * 1000000);
    try {
        // await conexion.execute(`CALL CREARORD_COMPRA(${ID} ,   '${body.cantidad}','${body.peso}' ,  '${body.direccion}' , '${body.fecha_compra}', '${body.nombre_producto}', ${body.id_referencia})`);
        // await conexion.commit();
        const productos = JSON.parse(body.products);
        const direccion =  body.direccion;
        const fecha = body.fecha;
        const id_referencia = body.id_referencia;
        const refigeracion =  body.refigeracion;
        // const id_referencia = body.id_referencia;
        // console.log(body)
        for(let  p  in productos){
            const {CANTIDAD, NOMBRE, unidad} = productos[p];
            // const productoFinal = { cantidad: unidad,nombre_producto: NOMBRE, peso: unidad, direccion, fecha_compra:fecha, id_referencia}
            await conexion.execute(`CALL CREARORD_COMPRA(${ID} ,   '${unidad}','${unidad}' , '${TIPO_CLIENTE}' , '${direccion}' , '${fecha}', '${NOMBRE}', ${id_referencia}, '${refigeracion}')`);
            await conexion.commit();
        }
        resp.json('Correct')
    } catch (error) {
        console.log(error)
        resp.status(400).send(error)
    }
}

const crearPedidoLocal = async(req, resp) =>{
    const {ID: ID_CLIENTE, TIPO_CLIENTE} = req.usuario;

    const body = req.body;

    try {
        // await conexion.execute(`CALL CREARORD_COMPRA(${ID} ,   '${body.cantidad}','${body.peso}' ,  '${body.direccion}' , '${body.fecha_compra}', '${body.nombre_producto}', ${body.id_referencia})`);
        // await conexion.commit();
        const productos = JSON.parse(body.products);
        const direccion =  body.direccion;
        const fecha = body.fecha;
        const id_referencia = body.id_referencia;
        const id_transportista = body.id_transportista;
        const precio_transporte = body.precio_transporte;
        // const id_referencia = body.id_referencia;
        // console.log(body)
        for(let  p  in productos){
            const {CANTIDAD, NOMBRE, unidad, ID_PRODUCTOR, ID:ID_PRODUCTO, PRECIO} = productos[p];
            // const productoFinal = { cantidad: unidad,nombre_producto: NOMBRE, peso: unidad, direccion, fecha_compra:fecha, id_referencia}
            await conexion.execute(`CALL CREARORD_COMPRA_LOCAL(${ID_CLIENTE} , ${ID_PRODUCTOR},  ${ID_PRODUCTO}, ${PRECIO}  ,'${unidad}','${unidad}' , '${TIPO_CLIENTE}' ,
            '${direccion}' , '${fecha}', '${NOMBRE}', ${id_referencia}, ${id_transportista},${precio_transporte})`);
            await conexion.commit();
        }
        resp.json('Correct')
    } catch (error) {
        console.log(error)
        resp.status(400).send(error)
    }
}



const obtenerPedidos = async(req, resp) =>{
    const {ID} = req.usuario;
    try {
        const respuesta  = await conexion.execute(`select o.*, o.precio_transporte precioT from ord_compra o left join transportista t on o.id_transportista = t.id where id_cliente = ${ID} order by fecha_compra desc`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        // select o.*, t.precio from ord_compra o join transportista t on o.id_transportista = t.id where id_cliente = ${ID} order by o.fecha_compra desc;
        // select * from ord_compra where id_cliente = 142 order by fecha_compra desc;

        resp.json(respuesta.rows)
    } catch (error) {
        console.log(error)
    }
}

const obtenerBoleta = async(req, resp) => {
    const {id} = req.params;
    try {
        const respuesta = await conexion.execute(`select monto_pagado from boleta where numero_sesion = ${id}`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        // console.log(respuesta.rows[0])
        resp.json(respuesta.rows[0])
    } catch (error) {
        console.log(error)
    }
}

const confirmarRecepcionPedidoLocal  = async(req, resp) =>{
    const {id:referencia_compra} = req.params;
    try {
        await conexion.execute(`call RECEPCION_ENVIO_ACEPTADO_LOCAL(${referencia_compra})`);
        await conexion.commit();
        resp.json('Confirmación exitosa');
    } catch (error) {
        console.log(error)
    }
}

export {
    obtenerClientes,
    regitrarCliente,
    autenticar,
    agregarDatos,
    traerDatosCliente,
    crearPedidoExt,
    obtenerPedidos,
    crearPedidoLocal,
    obtenerBoleta,
    confirmarRecepcionPedidoLocal
    // perfil
}


