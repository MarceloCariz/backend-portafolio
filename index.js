import express from "express";
import conectarDB from "./config/index.js";
import clienteRoutes from './routes/clienteRoutes.js'
import productorRoutes from './routes/productorRoutes.js'
import productosRoutes from './routes/productosRoutes.js'

import cors from 'cors'
import dotenv from 'dotenv';
const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();
// await conectarDB();
app.use('/api/clientes', clienteRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/productores', productorRoutes)
app.use(express.urlencoded({extended: false}))
const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el servidor ${PORT}`)
})