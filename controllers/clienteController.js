import oracledb from "oracledb"
import conectarDB from "../config/index.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import bcrypt from 'bcrypt'
const conexion =  await conectarDB();
const saltRounds = 10;

const obtenerClientes = async( req, resp) =>{
    const sql = "SELECT * FROM CLIENTES";
    const resultado =  await conexion.execute(sql,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
    // // const rs= await resultado.resultSet.getRow()
    // // console.log(await rs.NOMBRE)
    
    // console.log(resultado.rows[0])
    resp.json(resultado.rows)
} 

const regitrarCliente = async(req,resp)=>{
    try {
        const body = req.body;
      
        // const sql = "insert into clientes (nombre) values(':nombre')" ;
        body.correo = body.correo.toLowerCase();
        const validarUsuario = await conexion.execute( `select correo from clientes where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
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
        console.log(passwordHash.length)
        const resultado = await conexion.execute( `call REGISTRARCLIENTE('${body.nombre}','${passwordHash}','${body.correo}','${token}')`); 
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




export {
    obtenerClientes,
    regitrarCliente,
    autenticar,
    // perfil
}


