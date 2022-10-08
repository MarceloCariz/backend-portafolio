import oracledb from "oracledb"
import conectarDB from "../config/index.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import bcrypt from 'bcrypt'
const conexion =  await conectarDB();




const registrarTransportista = async(req,resp)=>{
    try {
        const body = req.body;
      
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
        body.correo = body.correo.toLowerCase();
        const resultado = await conexion.execute( `call REGISTRARTRANSPORTISTA('${body.nombre}','${passwordHash}','${body.correo}')`); 
        await conexion.commit();
        resp.json({msg: "insertado correctamente"})
    } catch (error) {
        console.log(error);
        resp.json({msg: "Hubo un error"})
    }

}
const obtenerTransportista= async( req, resp) =>{
    try {
        const sql = "SELECT ID, NOMBRE,CORREO  FROM transportista";
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
        const resultado = await conexion.execute(`call ESTADOENVIADO (${referencia_compra},${ID})`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        await conexion.commit();
        resp.json({msg: 'Envio confirmado'})
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
}
