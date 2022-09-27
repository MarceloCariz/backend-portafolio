import oracledb from "oracledb"
import conectarDB from "../config/index.js"

const conexion =  await conectarDB();

const obtenerProductos = async(req,resp) =>{

    try {
        const sql = 'select  P.NOMBRE, P.CALIDAD, P.CANTIDAD, P.ID_PRODUCTO, P.ID_PRODUCTOR, R.NOMBRE as PROVEEDOR, P.IMAGE_URL,  P.PRECIO_LOCAL ,P.PRECIO_EXP from producto P join productor R ON R.ID = P.ID_PRODUCTOR '
        const productos = await conexion.execute(sql,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});

        resp.json(productos.rows)
    } catch (error) {
        console.log(error)
    }

}


export{
    obtenerProductos
}