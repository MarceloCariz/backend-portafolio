import nodemailer from 'nodemailer';
export const correoPassword = async(correo, password, nombre, rol) =>{
const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.CORREO_HOST,
            pass: process.env.CONTRASENA_CORREO
        }
      // host: "smtp.mailtrap.io",
      // port: 2525,
      // auth: {
      //   user: "9990287e1fb476",
      //   pass: "961261a0fa7dc3"
      // }
    });
    
    let info = await transport.sendMail({
      from: '"MaipoGrande 🌱" <soporte@maipogrande.com>', // sender address
      to: correo, // list of receivers
      subject: "Creacion de usuario MaipoGrande 👤", // Subject line
      text: "Creacion de usuario MaipoGrande 👤", // plain text body
        html: `
        <div class="font-family: sans-serif;">
            <h1>Hola ${nombre}</h1>
            <b>Felicidades creaste tu cuenta como ${rol} en maipo grande</b>
            <b>, Para ingresar usa estos parametros</b>
            <p>Correo: ${correo}</p>
            <p>Contraseña: ${password}</p>
            <a href="www.maipogrande.ml">Ir a MaipoGrande</a>
        </div>

        `
      , // html body
    });

}
