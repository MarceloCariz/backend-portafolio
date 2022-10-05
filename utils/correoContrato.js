import nodemailer from 'nodemailer';

export const correoContrato = async(CORREO, NOMBRE) =>{
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.CORREO_HOST,
    pass: process.env.CONTRASENA_CORREO
  }
});
let info = await transport.sendMail({
  from: '"MaipoGrande 👻" <soporte@maipogrande.com>', // sender address
  to: CORREO, // list of receivers
  subject: "CONTRATO CADUCADO 😭😭😭😭😭😭😭😭", // Subject line
  text: "CONTRATO CADUCADO 😭😭😭😭😭😭😭😭", // plain text body
  html: `
  <h1>Hola ${NOMBRE}</h1>
  <b>Alerta  su contrato ha terminado, por favor renovarlo con el administrador</b>`, // html body
});

}
