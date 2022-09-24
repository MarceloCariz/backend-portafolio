import nodemailer from 'nodemailer';

export const correoContrato = async(email) =>{

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: "marcelocariz4@gmail.com",
    pass: "fvyygyfshmshlxto"
  }
});

let info = await transport.sendMail({
  from: '"MaipoGrande 👻" <soporte@maipogrande.com>', // sender address
  to: email, // list of receivers
  subject: "CONTRATO CADUCADO 😭😭😭😭😭😭😭😭", // Subject line
  text: "CONTRATO CADUCADO 😭😭😭😭😭😭😭😭", // plain text body
  html: "<b>Alerta su contrato ha terminado, por favor renovarlo con el administrador</b>", // html body
});

}
