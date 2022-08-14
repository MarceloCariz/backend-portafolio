import oracledb from 'oracledb';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const instantClient =path.resolve(__dirname,'instantclient_21_7');
const wallet =path.resolve(__dirname,'Wallet_MAIPOGRANDE');

console.log(wallet)
console.log(instantClient)

// oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
// 'C:\\Users\\Default.LAPTOP-V3GJG796\\Desktop\\PORTAFOLIO\\backend\\backend-portafolio\\config\\instantclient_21_6'
oracledb.initOracleClient({configDir:  instantClient});
const cs = `tcps://adb.sa-saopaulo-1.oraclecloud.com:1522/g4398818274a3ca_maipogrande_high.adb.oraclecloud.com?wallet_location=${wallet}&retry_count=20&retry_delay=3`
console.log(path.join("/config/Wallet_MAIPOGRANDE"))
const conectarDB = async() =>{
    let conexion;
    try {
    conexion  = await oracledb.getConnection({user:"ADMIN",password: "Maipogrande2022", connectionString: cs});
 
    console.log('conectado perro')
  
    return conexion;
    } catch (error) {
        console.log(error)
    }
}


export default conectarDB;