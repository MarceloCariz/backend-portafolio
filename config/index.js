import oracledb from 'oracledb';
// oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
import path from 'path';
oracledb.initOracleClient({libDir: 'C:\\Users\\marce\\OneDrive\\Escritorio\\PORTAFOLIO\\instantclient_21_6'});
const cs = 'tcps://adb.sa-saopaulo-1.oraclecloud.com:1522/g4398818274a3ca_maipogrande_high.adb.oraclecloud.com?wallet_location=C:\\Users\\marce\\OneDrive\\Escritorio\\PORTAFOLIO\\backend\\config\\Wallet_MAIPOGRANDE&retry_count=20&retry_delay=3'
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