import jwt from "jsonwebtoken";
import OracleDB from "oracledb";
import conectarDB from "../config/index.js";
const conexion =  await conectarDB();

const checkAuth = async(req, resp, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            if(decoded.rol === 'cliente'){
                req.usuario = await conexion.execute(`select id,nombre, id_rol , correo, tipo_cliente from ${decoded.rol} where ID = '${decoded.id}'`,{},{outFormat: OracleDB.OUT_FORMAT_OBJECT})
                req.usuario = req.usuario.rows[0] ;
                return next(); /// se pasa al siguiente middleware es decir PERFIL
            }
            // req.usuario =  await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")
            // req.usuario =  await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")
            req.usuario = await conexion.execute(`select id,nombre, id_rol , correo from ${decoded.rol} where ID = '${decoded.id}'`,{},{outFormat: OracleDB.OUT_FORMAT_OBJECT})
            req.usuario = req.usuario.rows[0] ;
            // console.log('decoded'+decoded.ID)
            // console.log('token'+token)

            // console.log(req.usuario)
            return next(); /// se pasa al siguiente middleware es decir PERFIL
        } catch (error) {
            return resp.status(404).json({msg:"Hubo un error"})
        }
    }
    if(!token){
        const error = new Error("token no valido")
        return resp.status(401).json({msg: error.message})
    }
    next()
}

export default checkAuth;



