import express from "express";
import conectarDB from "./config/index.js";
import clienteRoutes from './routes/clienteRoutes.js'
import productorRoutes from './routes/productorRoutes.js'
import productosRoutes from './routes/productosRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import transportistaRoutes from './routes/transportistaRoutes.js';
import administradorRoutes from './routes/administradorRoutes.js'
import subastasRoutes from './routes/subastaRoutes.js'
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

const server = http.createServer(app);
const io = new SocketServer(server,{
  cors:{
    origin: '*'
  }
})
const postulaciones = [];

// io.of
io.on('connection', (socket)=>{
  console.log('Comenzo')
  socket.on('postular', (producto, finish)=>{

    for(const p  in producto){
      postulaciones.push(producto[p])
    }
    // return
    // (producto)

    // console.log(postulaciones)
    const productosUniques = postulaciones.reduce((acc, product)=>{
      if(!acc[product.NOMBRE]){
        acc[product.NOMBRE] = []
      }
      // console.log(product)
      acc[product.NOMBRE].push(product)

      return acc
    },[]);

    const productosElegidos = []

    for(const p in productosUniques){
     
      const minprecio = productosUniques[p].sort((a,b)=>(
        a.PRECIO_EXP - b.PRECIO_EXP
      ))
      productosElegidos.push(minprecio[0])
    }
    // console.log( arrSinDuplicaciones );
    // console.log(postulaciones)

    // return productosElegidos
    if(finish === true){
      console.log(productosElegidos)
      socket.disconnect(true)
      console.log(socket.id, 'desconectado')
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