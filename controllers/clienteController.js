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
        const resultado = await conexion.execute( `CALL REGISTRARCLIENTE('${body.nombre}','${passwordHash}','${body.correo}', '${body.tipo}')`); 
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
    const {ID} = req.usuario;
    const body = req.body;
    // , referencia_compra
    const id_referencia = Math.floor(Math.random() * 1000000);
    try {
        await conexion.execute(`CALL CREARORD_COMPRA(${ID} ,   '${body.cantidad}','${body.peso}' ,  '${body.direccion}' , '${body.fecha_compra}', '${body.nombre_producto}', ${body.id_referencia})`);
        conexion.commit();
    } catch (error) {
        console.log(error)
    }
}

const obtenerPedidos = async(req, resp) =>{
    const {ID} = req.usuario;
    try {
        const respuesta  = await conexion.execute(`select * from ord_compra where id_cliente = ${ID}`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        resp.json(respuesta.rows)
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
    obtenerPedidos
    // perfil
}


