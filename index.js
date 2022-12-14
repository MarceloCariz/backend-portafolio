import express from "express";
import conectarDB from "./config/index.js";
import clienteRoutes from './routes/clienteRoutes.js'
import productorRoutes from './routes/productorRoutes.js'
import productosRoutes from './routes/productosRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import transportistaRoutes from './routes/transportistaRoutes.js';
import administradorRoutes from './routes/administradorRoutes.js';
import subastasRoutes from './routes/subastaRoutes.js';
import trankbankRoutes from './routes/transbankRoutes.js';
import oracledb from "oracledb"
import { fileURLToPath } from 'url';
import multer from "multer";
import dotenv from 'dotenv';
import path from 'path'
import cors from 'cors'
import http from 'http';
import cron from 'node-cron';
import { Server as SocketServer } from "socket.io";
import { correoContrato } from "./utils/correoContrato.js";
import { v4 as uuidv4 } from 'uuid';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();


app.use(express.json());
app.use(cors());
dotenv.config();
// const storage = multer.diskStorage({
//     destination: path.join(__dirname, "public/img"),
//     filename: (req, file, cb, filename) => {
//       cb(null, file.originalname);
//     },
// });
// app.use(multer({ storage: storage }).single("image"));
const assign = multer.diskStorage({
  destination:function(req,file,cb){
    const dirImage='./public/img/';
    const dirPdf='./public/reportes/';

    if(file.fieldname === 'image'){
      cb(null,dirImage);
      }else if(file.fieldname==='reporte'){
      cb(null,dirPdf);
      }
  },
  filename: (req, file, cb, filename) => {
          if(file.fieldname === "reporte"){
            cb(null, uuidv4() + '.pdf');
          }
          if(file.fieldname === "image"){
            cb(null, uuidv4() + '.jpg');
          }
  },
})
app.use(multer({ storage: assign }).fields([{name: "image", maxCount: 1}, {name: "reporte", maxCount: 1}]));

app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "public")));
// await conectarDB();
// RUTAS
app.use('/api/clientes', clienteRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/productores', productorRoutes);
app.use('/api/transportista',transportistaRoutes);
app.use('/api/subasta',subastasRoutes);
app.use('/api/admin', administradorRoutes);
app.use('/api/transbank', trankbankRoutes); 

const conexion = await conectarDB();


// CORREO SCHEDULE JOBS
cron.schedule('25 18 * * *',async()=>{

  const fechaActual = new Date(Date.now());
  const contratosP = await conexion.execute("select P.NOMBRE, P.CORREO, C.ID_CONTRATO, C.FECHA_TERMINO from contrato C JOIN PRODUCTOR P ON P.ID_CONTRATO = C.ID_CONTRATO",{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
  const contratosT = await conexion.execute("select T.NOMBRE, T.CORREO, C.ID_CONTRATO, C.FECHA_TERMINO from contrato C JOIN TRANSPORTISTA T ON T.ID_CONTRATO = C.ID_CONTRATO",{},{outFormat: oracledb.OUT_FORMAT_OBJECT});

  const contratos = contratosP.rows.concat(contratosT.rows);
  // console.log(contratos)
  for(const c in contratos){
    const {FECHA_TERMINO ,ID_CONTRATO, CORREO, NOMBRE} = contratos[c];
    const isNegative = new Date(FECHA_TERMINO).getTime() - fechaActual.getTime() ;
    // console.log(isNegative);
    if(isNegative < 0){
      // const consultaCorreo = await conexion.execute(`SELECT P.CORREO, P.NOMBRE  FROM PRODUCTOR P JOIN CONTRATO C ON P.ID_CONTRATO = C.ID_CONTRATO WHERE C.ID_CONTRATO = ${ID_CONTRATO} `,{},{outFormat: oracledb.OUT_FORMAT_OBJECT});
      // const {CORREO, NOMBRE } = consultaCorreo.rows[0];
      console.log(CORREO);
      // const correo = consultaCorreo.rows[0].CORREO;
      await conexion.execute(`call CAMBIOESTADOCONTRATO(${ID_CONTRATO})`);
      await conexion.commit();
      // console.log(correo);
      correoContrato(CORREO, NOMBRE);
      
    }
  }
})

///////////////////////////////////////////////////////////
const server = http.createServer(app);
const io = new SocketServer(server,{
  cors:{
    origin: '*'
  }
})
// const fecha = new Date(Date.now()).toLocaleString("en-US", {timeZone: "America/Santiago"});
// console.log(fecha)

// console.log(new Date(fecha))

// io.of
let postulaciones = [];
let productosElegidos = [];
let postulacionesTransportista= [];
let seleccionadoTransportista = [];


io.on('connection', async(socket)=>{
  socket.on('postular',async (producto, fechaFinal, idCompra)=>{
      postulaciones.push(producto);
    // for(const p  in producto){
    //   postulaciones.push(producto[p])
    // }

    // console.log(ordenarMinprecio[0]);
    // const productosUniques = postulaciones.reduce((acc, product)=>{
    //   if(!acc[product.NOMBRE]){
    //     acc[product.NOMBRE] = []
    //   }
    //   // console.log(product)
    //   acc[product.NOMBRE].push(product)

    //   return acc
    // },[]);

    // productosElegidos = []
    // productosElegidos.push(productosUniques);
    // for(const p in productosUniques){
    //   const minprecio = productosUniques[p].sort((a,b)=>(
    //     a.PRECIO_EXP - b.PRECIO_EXP
    //   ))

    //   productosElegidos.push(...minprecio)
    // }

      // const minPrecio = elegidosPorIdCompra.map(())
      // const minprecio = productosUniques[p].sort((a,b)=>(
      //   a.PRECIO_EXP - b.PRECIO_EXP
      // ))

      // productosElegidos.push(...minprecio)
    
})

  socket.on('subasta:finalizar' , async(estado, idCompra, NOMBRE_PRODUCTO, id, idSubastaC)=>{
    if(estado){
      const elegidosPorIdCompra = postulaciones.filter(({REFERENCIA_COMPRA, NOMBRE})=>(REFERENCIA_COMPRA === idCompra && NOMBRE === NOMBRE_PRODUCTO));
      // const idCompravacio =postulaciones.filter(({REFERENCIA_COMPRA})=>(REFERENCIA_COMPRA === idCompra ))
      // console.log(elegidosPorIdCompra.sort((a,b)=>(a.PRECIO_EXP - b.PRECIO_EXP)));
      if(elegidosPorIdCompra.length <= 0){
        await conexion.execute(`UPDATE ORD_COMPRA SET ACTIVO = 'false' WHERE REFERENCIA_COMPRA = ${idCompra}`);
        await conexion.commit();
        return;
      };
      const ordenarMinprecio = elegidosPorIdCompra.sort((a,b)=>(a.PRECIO_EXP - b.PRECIO_EXP));
  
      
      const {ID_PRODUCTO, ID_PRODUCTOR,NOMBRE, idSubasta} = ordenarMinprecio[0];
      await conexion.execute(`call ANADIRPRODUCTOEXT(${idCompra},${ID_PRODUCTOR},${ID_PRODUCTO},'${NOMBRE}')`);
      await conexion.commit();
      const mensaje = 'Tu ganaste la subasta!'
      // socket.emit('transportista-mensaje');
      if(ID_PRODUCTOR === id){
        socket.emit('client-subasta',mensaje, ID_PRODUCTOR, idCompra, NOMBRE_PRODUCTO,idSubasta);
      }
      postulaciones = postulaciones.filter(({REFERENCIA_COMPRA, NOMBRE, idSubasta:idP, ID_PRODUCTOR})=>(idP !== idSubasta  ));

      // if(ordenarMinprecio[0].idSubasta !== idSubasta || ID_PRODUCTOR !== id ) return;
 


      return;
  
    }
})
socket.on('postularT',async (transt)=>{
    postulacionesTransportista.push(transt);
})

socket.on('finalizar:T' , async(estado, idCompra, id)=>{

  if(estado){
      // for(const t in postulacionesTransportista){
            // seleccionadoTransportista.push(postulacionesTransportista[t]);
            const filtrado= postulacionesTransportista.filter(({REFERENCIA_COMPRA})=>(REFERENCIA_COMPRA === idCompra));
            // const existe = postulacionesTransportista.some(({ID})=>(ID === id));
            if(filtrado.length <= 0){
              await conexion.execute(`UPDATE ORD_COMPRA SET ACTIVO = 'false' WHERE REFERENCIA_COMPRA = ${idCompra}`);
              await conexion.commit();
              return;
            };
            // if(existe === false) return;
            const transportista = filtrado.sort((a, b) => a.PRECIO - b.PRECIO);
            if(transportista[0].ID !== id ) return;

            await conexion.execute(`call ANADIR_TRANSPORTISTA_EXT(${idCompra},${transportista[0].ID})`)
            await conexion.commit();
            const mensaje = 'Tu ganaste la subasta!'
            socket.emit('transportista-mensaje',mensaje, transportista[0].ID, idCompra);
            postulacionesTransportista= postulacionesTransportista.filter(({REFERENCIA_COMPRA})=>(REFERENCIA_COMPRA !== idCompra));
            console.log(postulacionesTransportista)
            seleccionadoTransportista= [];


      return;
  }})

  // if(estado){

  //   socket.emit('client-subasta',productosElegidos);
  //   let promises = [];
  //   const precio = seleccionado.sort((a, b) => a.precio - b.precio);

  //   for(const p in productosElegidos){
  //     const {ID_PRODUCTO, ID_PRODUCTOR,NOMBRE} = productosElegidos[p];
  //     await conexion.execute(`call ANADIRPRODUCTOEXT(${idCompra},${ID_PRODUCTOR},${ID_PRODUCTO},'${NOMBRE}')`)
  //     await conexion.commit()
  //   }
  //     await conexion.execute(`UPDATE ORD_COMPRA SET ACTIVO = 'false' WHERE REFERENCIA_COMPRA = ${idCompra}`);
  //     await conexion.commit();
  //   postulaciones = []
  //   socket.disconnect(true)
  //   return
  // }







})


// enviarNotificacionContrato();

const PORT = process.env.PORT || 4000;

server.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el servidor ${PORT}`)
})