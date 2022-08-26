import express from "express";
import conectarDB from "./config/index.js";
import clienteRoutes from './routes/clienteRoutes.js'
import productorRoutes from './routes/productorRoutes.js'
import productosRoutes from './routes/productosRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import transportistaRoutes from './routes/transportistaRoutes.js';
import { fileURLToPath } from 'url';
import multer from "multer";
import dotenv from 'dotenv';
import path from 'path'
import cors from 'cors'

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

app.use(express.static(path.join(__dirname, "public")));
// await conectarDB();
app.use('/api/clientes', clienteRoutes)
app.use('/api/usuario', usuarioRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/productores', productorRoutes)
app.use('/api/transportista',transportistaRoutes)


app.use(express.urlencoded({extended: false}))
const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el servidor ${PORT}`)
})