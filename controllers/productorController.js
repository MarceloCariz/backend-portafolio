import oracledb from "oracledb"
import conectarDB from "../config/index.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import bcrypt from 'bcrypt'
const conexion =  await conectarDB();
const saltRounds = 10;

const obtenerProductores = async( req, resp) =>{
    const sql = "SELECT * FROM PRODUCTOR";
    const resultado =  await conexion.execute(sql,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
    // // const rs= await resultado.resultSet.getRow()
    // // console.log(await rs.NOMBRE)
    
    // console.log(resultado.rows[0])
    resp.json(resultado.rows)
} 
const registrarProductor = async(req,resp)=>{
    try {
        const body = req.body;
      
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
        body.correo = body.correo.toLowerCase();
        const resultado = await conexion.execute( `call REGISTRARPRODUCTOR('${body.nombre}','${passwordHash}','${body.correo}')`); 
        await conexion.commit();
        resp.json({msg: "insertado correctamente"})
    } catch (error) {
        console.log(error);
        resp.json({msg: "Hubo un error"})
    }

}



const obtenerProductos = async(req, resp)=>{
    const { usuario } = req; //midellwareProductor
    const {ID} = usuario;
    console.log(ID)
    const sql = `SELECT * FROM PRODUCTO WHERE id_productor = ${ID}`;
    const resultado =  await conexion.execute(sql,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
    // // const rs= await resultado.resultSet.getRow()
    // // console.log(await rs.NOMBRE)
    
    // console.log(resultado.rows[0])
    resp.json(resultado.rows)
}

const nuevoProducto = async(req, resp) =>{
    try {   
        // console.log(req.usuario)
        const {ID} = req.usuario;
        const {nombre, cantidad, precio_local, precio_ext, calidad} = req.body;
        const nuevoProducto = await conexion.execute(`call REGISTRARPRODUCTO('${nombre}',${cantidad}, ${precio_local},${precio_ext},${ID},'${calidad}' ) `);
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
        console.log(idp)
        await conexion.execute(`call ELIMINARPRODUCTO(${idp},${ID})`)
        resp.json({msg: 'Eliminado Correctamente'})
    } catch (error) {
        console.log(error)
    }
}

const editarProducto = async(req, resp)=>{
    try {
        const {ID} = req.usuario;
        const {id_producto,nombre, cantidad, precio_local, precio_ext, calidad} = req.body;
        await conexion.execute(`CALL EDITARPRODUCTO(${id_producto},'${nombre}',${cantidad},${precio_local},${precio_ext},${ID}, '${calidad}', '')`)
        resp.json({msg:'Editado correctamente'})
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
    nuevoProducto
}



// const autenticar = async (req,resp) =>{
//     try {
//         const body = req.body;
//         const correo = await conexion.execute( `select correo from productor where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
//         if(correo.rows.length === 0){
//             const error = new Error("Contraseña o correo incorrectos");
//             return resp.status(400).json({ msg: error.message });
//         }


//         // const sql = "insert into clientes (nombre) values(':nombre')" ;
//         const contrasena = await conexion.execute( `select contrasena from productor where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
//         const validacionContrasena = await bcrypt.compare( body.password, contrasena.rows[0].CONTRASENA);

//         if(!validacionContrasena){
//             const error = new Error("Contraseña o correo incorrectos");
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