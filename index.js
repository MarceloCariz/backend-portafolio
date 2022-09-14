import express from "express";
import conectarDB from "./config/index.js";
import clienteRoutes from './routes/clienteRoutes.js'
import productorRoutes from './routes/productorRoutes.js'
import productosRoutes from './routes/productosRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import transportistaRoutes from './routes/transportistaRoutes.js';
import administradorRoutes from './routes/administradorRoutes.js'
import subastasRoutes from './routes/subastaRoutes.js'
import trankbankRoutes from './routes/transbankRoutes.js'
import { fileURLToPath } from 'url';
import multer from "multer";
import dotenv from 'dotenv';
import path from 'path'
import cors from 'cors'
import http from 'http';
import { Server as SocketServer } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();


app.use(express.json());
app.use(cors());
dotenv.config();
const storage = multer.diskStorage({
    destination: path.join(__dirname, "public/img"),
    filename: (req, file, cb, filename) => {
      cb(null, file.originalname);
    },
});
app.use(multer({ storage: storage }).single("image"));
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

const server = http.createServer(app);
const io = new SocketServer(server,{
  cors:{
    origin: '*'
  }
})
let postulaciones = [];
let productosElegidos = []
// const fecha = new Date(Date.now()).toLocaleString("en-US", {timeZone: "America/Santiago"});
// console.log(fecha)

// console.log(new Date(fecha))

// io.of
const conexion =  await conectarDB();

io.on('connection', (socket)=>{

  socket.on('postular', (producto, finish)=>{

    for(const p  in producto){
      postulaciones.push(producto[p])
    }

    const productosUniques = postulaciones.reduce((acc, product)=>{
      if(!acc[product.NOMBRE]){
        acc[product.NOMBRE] = []
      }
      // console.log(product)
      acc[product.NOMBRE].push(product)

      return acc
    },[]);

    productosElegidos = []

    for(const p in productosUniques){
     
      const minprecio = productosUniques[p].sort((a,b)=>(
        a.PRECIO_EXP - b.PRECIO_EXP
      ))
      productosElegidos.push(minprecio[0])
    }
    // console.log( arrSinDuplicaciones );
    if(finish){
      socket.disconnect(true)
      return

    }
  })

  socket.on('subasta:finalizar' , async(estado, idCompra)=>{
    if(estado){

      socket.emit('client-subasta',productosElegidos);
      let promises = [];
      for(const p in productosElegidos){
        const {ID_PRODUCTO, ID_PRODUCTOR,NOMBRE} = productosElegidos[p];
        await conexion.execute(`call ANADIRPRODUCTOEXT(${idCompra},${ID_PRODUCTOR},${ID_PRODUCTO},'${NOMBRE}')`)
        await conexion.commit()
      }
        await conexion.execute(`UPDATE ORD_COMPRA SET ACTIVO = 'false' WHERE REFERENCIA_COMPRA = ${idCompra}`);
        await conexion.commit();
      postulaciones = []
      socket.disconnect(true)
      return
    }
 
})

  // setTimeout(()=>{
  //   console.log('PRODUCTOS -----------',productosElegidos)
  //   socket.disconnect(true)
  //   console.log(socket.id, 'desconectado')
  // },15000)


})
const PORT = process.env.PORT || 4000;

server.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el servidor ${PORT}`)
})