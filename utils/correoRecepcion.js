import nodemailer from 'nodemailer';
export const correoRecepcion = async(CORREO, NOMBRE, numeroPedido, productos) =>{

  const fecha = new Date().toLocaleString("ES-CL", {weekday: "long", day:"2-digit", month:"long", year:"numeric"});
  let htmlProducts =`
      <table class="border-collapse: collapse;">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>PRECIO</th>
            <th>CANTIDAD</th>
            <th>FECHA_COMPRA</th>
          </tr>
        </thead>
        <tbody>`;
  for(const p in productos){
    const {ID, NOMBRE_PRODUCTO, PRECIO, CANTIDAD, FECHA_COMPRA} = productos[p];
    htmlProducts += `
    <tr>
      <td>${ID}</td>
      <td>${NOMBRE_PRODUCTO}</td>
      <td>${PRECIO}</td>
      <td>${CANTIDAD}</td>
      <td>${FECHA_COMPRA}</td>
    </tr>
    ` 
  }

  htmlProducts += '</table>'
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
      subject: "Pedido recepcionado 🚚", // Subject line
      text: "Pedido recepcionado 🚚", // plain text body
      html: `
      <div class="font-family: sans-serif;">
        <h1>Hola ${NOMBRE}</h1>
        <b>Su pedido numero #${numeroPedido}</b>
        <p>Ya se encuentra recepcionado el dia ${fecha} </p>

              
          ${htmlProducts}

      </div>

      `
      // html body
    });

}
