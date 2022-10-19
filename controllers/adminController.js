import oracledb from "oracledb"
import conectarDB from "../config/index.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import bcrypt from 'bcrypt'
const conexion =  await conectarDB();




const registrarAdministrador= async(req,resp)=>{
    try {
        const body = req.body;
      
        // const sql = "insert into clientes (nombre) values(':nombre')" ;
        const validarUsuario = await conexion.execute( `select correo from administrador where correo = '${body.correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
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
        const resultado = await conexion.execute( `call REGISTRARADMINISTRADOR(2,'${body.nombre}','${passwordHash}','${body.correo}')`); 
        await conexion.commit();
        resp.json({msg: "insertado correctamente"})
    } catch (error) {
        console.log(error);
        resp.json({msg: "Hubo un error"})
    }

}

const activarSubasta = async(req, resp ) =>{
    try {
        const {referencia_compra,fecha_activacion,activo} = req.body;
        const resultado = await conexion.execute(`call ACTIVARORD(${referencia_compra}, '${fecha_activacion}', '${activo}')`)
        await conexion.commit();
        resp.json({msg: "activado correctamente"})
    } catch (error) {
        console.log(error)
        resp.json({msg: 'hubo un error'});

    }
}
// ACTIVARORD_TRANSPORTISTA
const activarSubastaTransportista = async(req, resp ) =>{
    try {
        const {referencia_compra,fecha_activacion,activo} = req.body;
        const resultado = await conexion.execute(`call ACTIVARORD_TRANSPORTISTA(${referencia_compra}, '${fecha_activacion}', '${activo}')`)
        await conexion.commit();
        resp.json({msg: "activado correctamente"})
    } catch (error) {
        console.log(error)
        resp.json({msg: 'hubo un error'});

    }
}

//USUARIOS CRUD
///  PRODUCTOR
const eliminarProductor = async(req, resp) =>{
    try {
        const {id} = req.params;
        await conexion.execute(`call ELIMINARPRODUCTOR(${id})`)
        await conexion.commit();

        resp.json({msg: 'Eliminado Correctamente'})
    } catch (error) {
        console.log(error)
        resp.json({msg: 'hubo un error'});

    }
}

const actualizarProductor = async(req, resp) =>{
    const {id} = req.params;
    const {nombre, correo} = req.body;
    try {
        await conexion.execute(`call EDITAR_PRODUCTOR(${id}, '${nombre}','${correo}' )`)
        await conexion.commit();

        resp.json({msg: 'Actualizado Correctamente'})
    } catch (error) {
        console.log(error)
        resp.json({msg: 'hubo un error'});

    }
}

///  CLIENTES
const eliminarCliente= async(req, resp) =>{
    try {
        const {id} = req.params;
        await conexion.execute(`call ELIMINARCLIENTE(${id})`)
        await conexion.commit();

        resp.json({msg: 'Eliminado Correctamente'})
    } catch (error) {
        console.log(error)
        resp.json({msg: 'hubo un error'});

    }
}
const actualizarCliente = async(req, resp) =>{
    const {id} = req.params;
    const {nombre, correo} = req.body;
    try {
        await conexion.execute(`call EDITAR_CLIENTE(${id}, '${nombre}','${correo}' )`)
        await conexion.commit();

        resp.json({msg: 'Actualizado Correctamente'})
    } catch (error) {
        console.log(error)
        resp.json({msg: 'hubo un error'});

    }
}

////   TRANSPORTISTA
const eliminarTransportista= async(req, resp) =>{
    try {
        const {id} = req.params;
        await conexion.execute(`call ELIMINARTRANSPORTISTA(${id})`)
        await conexion.commit();

        resp.json({msg: 'Eliminado Correctamente'})
    } catch (error) {
        console.log(error)
        resp.json({msg: 'hubo un error'})
    }
}

const actualizarTransportista = async(req, resp) =>{
    const {id} = req.params;
    const {nombre, correo} = req.body;
    try {
        await conexion.execute(`call EDITAR_TRANSPORTISTA(${id}, '${nombre}','${correo}' )`)
        await conexion.commit();

        resp.json({msg: 'Actualizado Correctamente'})
    } catch (error) {
        console.log(error)
        resp.json({msg: 'hubo un error'})
    }
}
///  CONSULTOR
const registrarConsultor = async(req, resp)=>{
    try {
        const {id, nombre, password, correo} = req.body;
        const validarUsuario = await conexion.execute( `select correo from consultor where correo = '${correo}'`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        // // console.log(resultado)
        if(validarUsuario.rows.length === 1){
            const error = new Error("Usuario ya registrado");
            return resp.status(400).json({ msg: error.message });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash =  await bcrypt.hash(password, salt).then(function(hash) {
            return hash
        });
        const correoLowerCase = correo.toLowerCase();
        await conexion.execute(`CALL REGISTRAR_CONSULTOR(${id},'${nombre}', '${passwordHash}', '${correoLowerCase}' )`)
        await conexion.commit();
        resp.json({msg: "insertado correctamente"})
    } catch (error) {
        console.log(error);
        resp.json({msg: 'hubo un error'});

    }
}
const obtenerOrdenesCompra = async(req, resp) =>{
    try {
        const ordCompra = await conexion.execute(`select * from ord_compra`,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
        await conexion.commit();
        resp.json(ordCompra.rows);
    } catch (error) {
        console.log(error)
        resp.json({msg: 'hubo un error'});

    }
}

const renovacionContrato = async(req, resp) =>{
    try {
        const {id_contrato,fecha_inicio, fecha_termino} = req.body;
        await conexion.execute(`call RENOVACION_CONTRATO(${id_contrato},'${fecha_inicio}','${fecha_termino}')`);
        await conexion.commit();
        resp.json('renovacion exitosa');
    } catch (error) {
        console.log(error)
        resp.json({msg: 'hubo un error'});

    }
}

// GRAFICOS

const datosGraficos = async(req, resp) =>{
    const obj ={ outFormat: oracledb.OUT_FORMAT_OBJECT};
    try {
        const tipoVenta = await conexion.execute('SELECT DISTINCT tipo_venta, COUNT(*) cantidad FROM ord_compra GROUP BY tipo_venta',{},obj);
        const estadoPago = await conexion.execute('SELECT DISTINCT estado_pago, COUNT(*) cantidad FROM ord_compra GROUP BY estado_pago',{},obj);
        const clienteMayorVentas = await conexion.execute(`select count(o.referencia_compra) cantidad, o.referencia_compra, c.nombre from ord_compra o join cliente c on c.id = o.id_cliente 
        where o.estado_pago = 'PAGADO' group by o.referencia_compra ,c.nombre order by cantidad desc fetch first 1 row only `,{},obj);
        const topCincoProductos = await conexion.execute(`select count(o.id_producto) cantidad,  p.nombre from ord_compra o join producto p on p.id_producto = o.id_producto 
        where o.estado_pago = 'PAGADO'
        group by p.nombre
        order by cantidad desc fetch first 5 row only`,{},obj);
        const stockProductosNombre  = await conexion.execute(`select sum(cantidad) total, nombre from producto group by nombre`,{},obj);
        const comprasPorMes = await conexion.execute(`select to_char(to_date(fecha_compra, 'DD-MM-YYYY'), 'Month') as mes, count(fecha_compra)as total_compras  from ORD_COMPRA where estado_pago != 'RECHAZADO'
        group by to_char(to_date(fecha_compra, 'DD-MM-YYYY'), 'Month') `,{},obj);
        const comprasPorDia = await conexion.execute(`select to_char(to_date(fecha_compra, 'DD-MM-YYYY'), 'Day') as dia, count(fecha_compra)as total_compras  from ORD_COMPRA where estado_pago != 'RECHAZADO'
        group by to_char(to_date(fecha_compra, 'DD-MM-YYYY'), 'Day') order by total_compras desc`,{},obj);

        resp.json(
            {tipoVenta: tipoVenta.rows, estadoPago: estadoPago.rows, 
            clienteMayorVentas: clienteMayorVentas.rows, topCincoProductos: topCincoProductos.rows,  
            stockProductosNombre : stockProductosNombre.rows , comprasPorMes: comprasPorMes.rows,
            comprasPorDia: comprasPorDia.rows});
    } catch (error) {
        console.log(error);
        resp.json({msg: 'hubo un error'});

    }
}

export {
    registrarAdministrador,
    activarSubasta,
    obtenerOrdenesCompra,

    eliminarProductor,
    actualizarProductor,

    eliminarCliente,
    actualizarCliente,


    eliminarTransportista,
    actualizarTransportista,
    activarSubastaTransportista,

    registrarConsultor,

    renovacionContrato,

    //GRAFICOS
    datosGraficos
}