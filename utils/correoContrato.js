import nodemailer from 'nodemailer';
export const correoContrato = async(CORREO, NOMBRE) =>{
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
      to: CORREO, // list of receivers
      subject: "CONTRATO CADUCADO 😓", // Subject line
      text: "CONTRATO CADUCADO 😓", // plain text body
      html: `
      <div class="font-family: sans-serif;">
        <h1>Hola ${NOMBRE}</h1>
        <b>⚠️Alerta, ${NOMBRE}  su contrato ha terminado, por favor renovarlo con el administrador</b>
        <div class="display: flex, justify-content: center; align-items:center; margin: 3rem;">
          <a href="http://maipogrande.ml/"><img  src="https://i.imgur.com/TjUzixK.png" width="100%" alt="pasos para renovacion" /></a>
        </div>
      </div>

      `
      , // html body
    });

}
