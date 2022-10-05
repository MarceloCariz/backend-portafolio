import oracledb from "oracledb"
import conectarDB from "../config/index.js"
import generarJWT from "../helpers/generarJWT.js";
import bcrypt from 'bcrypt'
const conexion =  await conectarDB();



const autenticarUser = async (req,resp) =>{
    try {
        const body = req.body;
        const correo = await conexion.execute( `select correo from ${body.rol} where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        if(correo.rows.length === 0){
            const error = new Error("Contraseña o correo incorrectos");
            return resp.status(400).json({ msg: error.message });
        }
        const contrasena = await conexion.execute( `select contrasena from ${body.rol} where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        // const sql = "insert into clientes (nombre) values(':nombre')" ;
        const validacionContrasena = await bcrypt.compare( body.password, contrasena.rows[0].CONTRASENA);

        if(!validacionContrasena){
            const error = new Error("Contraseña o correo incorrectos");
            return resp.status(400).json({ msg: error.message });
        }
        const validarUsuario = await conexion.execute( `select * from ${body.rol} where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});

        const {ID, NOMBRE, TOKEN } = validarUsuario.rows[0];
        // const tipo = (TIPO_CLIENTE);
        const rol = body.rol;
        resp.json({msg: "Sesion valida",nombre: NOMBRE , token: generarJWT(ID,rol)})
    } catch (error) {
        console.log(error);
        resp.json({msg: "Hubo un error"})
    }
}


const perfil = async(req, resp) =>{
    const { usuario } = req;
    resp.json(usuario);
}

export {
    autenticarUser,
    perfil
}