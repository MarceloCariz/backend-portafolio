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
        const sql = "SELECT ID, NOMBRE  FROM transportista";
        const resultado =  await conexion.execute(sql,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        // // const rs= await resultado.resultSet.getRow()
        // // console.log(await rs.NOMBRE)
        
        // console.log(resultado.rows[0])
        resp.json(resultado.rows)
    } catch (error) {
        console.log(error)
    }

} 
export {
    registrarTransportista,
    obtenerTransportista
}