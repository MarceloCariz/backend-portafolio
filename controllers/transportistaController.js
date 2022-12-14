import oracledb from "oracledb"
import conectarDB from "../config/index.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import bcrypt from 'bcrypt'
import { correoPassword } from "../utils/correoPassword.js";
const conexion =  await conectarDB();




const registrarTransportista = async(req,resp)=>{
    try {
        const body = req.body;
        body.correo = body.correo.toLowerCase().trim();
        // const sql = "insert into clientes (nombre) values(':nombre')" ;
        const validarUsuario = await conexion.execute( `select correo from transportista where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
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
        // body.correo = body.correo.toLowerCase();
        const id_contrato = Math.floor(Math.random() * 1000000);
        const fecha = new Date(Date.now());
        const fechaInicio = (new Date(fecha).toISOString());
        const setMonth = fecha.setMonth(fecha.getMonth() + 1);
        // const setMinuto = fecha.setMinutes(fecha.getMinutes() + 1);

        const fechaTermino = (new Date(setMonth).toISOString());
        const resultado = await conexion.execute( `call REGISTRARTRANSPORTISTA('${body.nombre}','${passwordHash}','${body.correo}', ${id_contrato})`); 
        await conexion.commit();
        const contrato = await conexion.execute(`call REGISTRARCONTRATO(${id_contrato},'${fechaInicio}', '${fechaTermino}')`)
        await conexion.commit();
        resp.json({msg: "insertado correctamente"});
        await correoPassword(body.correo, body.password, body.nombre, 'transportista');

    } catch (error) {
        console.log(error);
        resp.json({msg: "Hubo un error"})
    }

}
const obtenerTransportista= async( req, resp) =>{
    try {
        const sql = "SELECT ID, NOMBRE,CORREO , PRECIO  FROM transportista";
        const resultado =  await conexion.execute(sql,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        // // const rs= await resultado.resultSet.getRow()
        // // console.log(await rs.NOMBRE)
        
        // console.log(resultado.rows[0])
        resp.json(resultado.rows)
    } catch (error) {
        console.log(error)
    }
}

const perfilTransportista = async (req, resp) =>{
    try {
        const body = req.body;
        const {ID} = req.usuario;
        const informacion = await conexion.execute( `CALL PERFILTRANSPORTISTA(${ID},${body.tamano},${body.capacidad}, ${body.carga}, '${body.refrigeracion}', ${body.precio})`);
        await conexion.commit();
        resp.json({msg: "Informacion actualizada"})
    } catch (error) {
        console.log(error)
    }
   
}
const traerDatos = async(req, resp) =>{
    try {
        const {ID} = req.usuario;
        const resultado = await conexion.execute(`select tamano, capacidad, carga, refrigeracion, precio from transportista where id = ${ID}`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT})
        resp.json(resultado.rows[0])
      } catch (error) {
        console.log(error)
      }
}

const obtenerSubastasActivas = async(req, resp)=>{
    try {
        const resultado = await conexion.execute(`select * from ord_compra where activo = 'true' and estado_envio = 'bodega' and tipo_venta = 'externo' `,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        resp.json(resultado.rows);
    } catch (error) {
        console.log(error)
    }
}

const obtenerPerfil = async(req,resp) =>{
    const {ID} = req.usuario;
    try {
        const perfil = await conexion.execute(`select * from transportista where id = ${ID}`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        resp.json(perfil.rows[0]);

    } catch (error) {
        console.log(error)
    }
}

const obtenerEnvios = async(req, resp)=>{
    try {
        const {ID} = req.usuario;
        const resultado = await conexion.execute(`select * from ord_compra where id_transportista = ${ID} `,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        resp.json(resultado.rows);

    } catch (error) {
        console.log(error)
    }
}


const confirmarPedidoenviado = async(req,resp) =>{
    try {
        const {ID} = req.usuario;
        const {referencia_compra} = req.body;
        const resultado = await conexion.execute(`UPDATE ORD_COMPRA SET
        ESTADO_ENVIO = 'enviado'
        WHERE REFERENCIA_COMPRA =  ${referencia_compra} and id_transportista = ${ID}`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        await conexion.commit();
        resp.json({msg: 'Envio confirmado'})
    } catch (error) {
        console.log(error)
    }
}

const obtenerContrato = async(req, resp)=>{
    try {
        const {ID} = req.usuario;
        const sql = `select C.ID_CONTRATO, C.FECHA_INICIO, C.FECHA_TERMINO, C.SUELDO, C.ESTADO, C.RENOVACION from contrato C JOIN TRANSPORTISTA P ON P.ID_CONTRATO = C.ID_CONTRATO WHERE P.ID = ${ID}`
        const consulta = await conexion.execute(sql,{},{outFormat: oracledb.OUT_FORMAT_OBJECT})
        const contrato = consulta.rows[0];
        resp.json(contrato);
    } catch (error) {
        console.log(error)
    }
}

const solicitudRenovacionContrato = async(req, resp) =>{
    try {
        const {id_contrato} = req.params;
        await conexion.execute(`call SOLICITUD_CONTRATO(${id_contrato})`);
        await conexion.commit();
        resp.json('Solicitado con exito');
    } catch (error) {
        console.log(error)
    }
}
const obtenerEnviosCompletados = async(req,resp) =>{
    try {
        const {ID} = req.usuario;
        const resultado = await conexion.execute(
            `select o.fecha_compra, o.referencia_compra, o.precio_transporte as precioT  from ord_compra o join transportista t on 
            t.id = o.id_transportista
            where o.id_transportista = ${ID} and ESTADO_ENVIO = 'recibido' group by  o.fecha_compra, o.referencia_compra,o.precio_transporte order by o.fecha_compra desc`,
            {},{outFormat: oracledb.OUT_FORMAT_OBJECT})
        resp.json(resultado.rows);
    } catch (error) {
        console.log(error)
    }
}


export {
    registrarTransportista,
    obtenerTransportista,
    perfilTransportista,
    traerDatos,
    obtenerSubastasActivas,
    obtenerPerfil,
    obtenerEnvios,
    confirmarPedidoenviado,
    obtenerContrato,
    solicitudRenovacionContrato,
    obtenerEnviosCompletados
}
