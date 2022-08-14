import express from "express";
import conectarDB from "./config/index.js";
import clienteRoutes from './routes/clienteRoutes.js'
import productorRoutes from './routes/productorRoutes.js'
import cors from 'cors'
import dotenv from 'dotenv';
const app = express();

app.use(express.json());
dotenv.config();
// await conectarDB();
app.use('/api/clientes', clienteRoutes)
app.use('/api/productores', productorRoutes)
app.use(cors());
app.use(express.urlencoded({extended: false}))
const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el servidor ${PORT}`)
})