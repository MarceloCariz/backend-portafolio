import oracledb from "oracledb"
import conectarDB from "../config/index.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import bcrypt from 'bcrypt'
import { correoPassword } from "../utils/correoPassword.js";
const conexion =  await conectarDB();
const saltRounds = 10;

const obtenerProductores = async( req, resp) =>{
    try {
        const sql = "SELECT * FROM PRODUCTOR";
        const resultado =  await conexion.execute(sql,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        // // const rs= await resultado.resultSet.getRow()
        // // console.log(await rs.NOMBRE)
        
        // console.log(resultado.rows[0])
        resp.json(resultado.rows)
    } catch (error) {
        console.log(error)
    }

} 
const registrarProductor = async(req,resp)=>{
    try {
        const body = req.body;
        body.correo = body.correo.toLowerCase().trim();

        // const sql = "insert into clientes (nombre) values(':nombre')" ;
        const validarUsuario = await conexion.execute( `select correo from productor where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
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

        const id_contrato = Math.floor(Math.random() * 1000000);

        const fecha = new Date(Date.now());
        const fechaInicio = (new Date(fecha).toISOString());
        const setMonth = fecha.setMonth(fecha.getMonth() + 1);
        // const setMinuto = fecha.setMinutes(fecha.getMinutes() + 1);

        const fechaTermino = (new Date(setMonth).toISOString());

        const resultado = await conexion.execute( `call REGISTRARPRODUCTOR('${body.nombre}','${passwordHash}','${body.correo}', ${id_contrato})`); 
        await conexion.commit();
        const contrato = await conexion.execute(`call REGISTRARCONTRATO(${id_contrato},'${fechaInicio}', '${fechaTermino}')`)
        await conexion.commit();
        resp.json({msg: "Agregado correctamente"});
        await correoPassword(body.correo, body.password, body.nombre, 'productor');
    } catch (error) {
        console.log(error);
        resp.json({msg: "Hubo un error"})
    }

}



const obtenerProductos = async(req, resp)=>{
    try {
        const { ID } = req.usuario; //midellwareProductor
        const sql = `SELECT * FROM PRODUCTO WHERE id_productor = ${ID}`;
        const resultado =  await conexion.execute(sql,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        // // const rs= await resultado.resultSet.getRow()
        // // console.log(await rs.NOMBRE)
        
        // console.log(resultado.rows[0])
        resp.json(resultado.rows)
    } catch (error) {
        console.log(error)
    }

}

const nuevoProducto = async(req, resp) =>{
    try {   
        // console.log(req.files);
        // return;
        const {ID} = req.usuario;
        const {nombre, cantidad, precio_local, precio_ext, calidad} = req.body;
        const imagen = req.files.image[0].filename;
        const nuevoProducto = await conexion.execute(`call REGISTRARPRODUCTO('${nombre}','${cantidad}', ${precio_local},${precio_ext},${ID},'${calidad}', '${process.env.HOST}/img/${imagen}' ) `);
        await conexion.commit();
        resp.json('anadido correctamente')
    } catch (error) {
        console.log(error)
    }
   
}

const eliminarProducto = async(req, resp) =>{
    try {
        const {ID} = req.usuario;
        const {idp} = req.params;
        await conexion.execute(`call ELIMINARPRODUCTO(${idp},${ID})`)
        await conexion.commit();

        resp.json({msg: 'Eliminado Correctamente'})
    } catch (error) {
        console.log(error)
    }
}

const editarProducto = async(req, resp)=>{
    try {
        const {ID} = req.usuario;
        const {id_producto,nombre, cantidad, precio_local, precio_ext, calidad} = req.body;
    
        await conexion.execute(`CALL EDITARPRODUCTO(${id_producto},'${nombre}',${cantidad},${precio_local},${precio_ext},${ID}, '${calidad}')`)
        await conexion.commit();
        resp.json({msg:'Editado correctamente'})
    } catch (error) {
        console.log(error)
    }
}

const obtenerSubastasActivas = async(req, resp)=>{
    try {
        const resultado = await conexion.execute(`select * from ord_compra where activo = 'true' and estado_envio = 'pendiente' `,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        resp.json(resultado.rows);
    } catch (error) {
        console.log(error)
    }
}

const obtenerEnvios = async(req, resp)=>{
    try {
        const {ID} = req.usuario;
        const resultado = await conexion.execute(`select * from ord_compra where id_productor = ${ID} `,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        resp.json(resultado.rows);
    } catch (error) {
        console.log(error)
    }
}

const obtenerEnviosCompletados = async(req,resp) =>{
    try {
        const {ID} = req.usuario;
        const resultado = await conexion.execute(`select * from ord_compra where id_productor = ${ID} and ESTADO_ENVIO = 'recibido'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT})
        resp.json(resultado.rows);
    } catch (error) {
        console.log(error)
    }
}

const confirmarEnviobodega = async(req,resp) =>{
    try {
        const {ID} = req.usuario;
        const {referencia_compra} = req.body;
        await conexion.execute(`CALL CAMBIO_ESTADO_BODEGA(${referencia_compra},${ID})`);
        await conexion.commit();
        resp.json({msg: 'Envio confirmado'})
    } catch (error) {
        console.log(error)
    }
}

const obtenerContrato = async(req, resp)=>{
    try {
        const {ID} = req.usuario;
        const sql = `select C.ID_CONTRATO, C.FECHA_INICIO, C.FECHA_TERMINO, C.SUELDO, C.ESTADO, C.RENOVACION from contrato C JOIN PRODUCTOR P ON P.ID_CONTRATO = C.ID_CONTRATO WHERE P.ID = ${ID}`
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

export {
    obtenerProductores,
    registrarProductor,
    eliminarProducto,
    editarProducto,
    obtenerProductos,
    nuevoProducto,
    obtenerSubastasActivas,
    obtenerEnvios,
    obtenerEnviosCompletados,
    confirmarEnviobodega,
    obtenerContrato,
    solicitudRenovacionContrato,
}



// const autenticar = async (req,resp) =>{
//     try {
//         const body = req.body;
//         const correo = await conexion.execute( `select correo from productor where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
//         if(correo.rows.length === 0){
//             const error = new Error("Contrase??a o correo incorrectos");
//             return resp.status(400).json({ msg: error.message });
//         }


//         // const sql = "insert into clientes (nombre) values(':nombre')" ;
//         const contrasena = await conexion.execute( `select contrasena from productor where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
//         const validacionContrasena = await bcrypt.compare( body.password, contrasena.rows[0].CONTRASENA);

//         if(!validacionContrasena){
//             const error = new Error("Contrase??a o correo incorrectos");
//             return resp.status(400).json({ msg: error.message });
//         }
//         const validarUsuario = await conexion.execute( `select * from productor where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});

//         const {ID, NOMBRE, TOKEN, ID_ROL} = validarUsuario.rows[0];
//         console.log(validarUsuario)
//         resp.json({msg: "Sesion valida",nombre: NOMBRE , token: generarJWT(ID,ID_ROL )})
//     } catch (error) {
//         console.log(error);
//         resp.json({msg: "Hubo un error"})
//     }
// }
// const perfil = async(req, resp) =>{
//     const { usuario } = req;

//     resp.json({...usuario, rol:'productor'});
//     // console.log('sadsad')
// }