import oracledb from "oracledb"
import conectarDB from "../config/index.js"

const conexion =  await conectarDB();

const obtenerProductos = async(req,resp) =>{

    try {
        const productos = await conexion.execute('select  id_producto, nombre, cantidad, precio_local, precio_exp from producto',{},{outFormat: oracledb.OUT_FORMAT_OBJECT});

        resp.json(productos.rows)
    } catch (error) {
        console.log(error)
    }

}


export{
    obtenerProductos
}