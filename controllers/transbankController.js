import pkg
 from 'transbank-sdk';
import conectarDB from '../config/index.js';

const {WebpayPlus ,Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = pkg;

const conexion =  await conectarDB();
const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));


const iniciarTbk = async(req, resp) =>{

    try {
        const {ID} = req.usuario;
        const {total, id_referencia} = req.body;
                                                                                                // "http://maipogrande.ml/inicio/pago"
        const crearTx = await tx.create(`Maipogrande-${id_referencia}`, `${id_referencia}`, total, "http://localhost:3000/inicio/pago");
        // // const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
        // // resp.json({url: response.ulr, token: response.token})
        // // const response = await tx.commit(crearTx.token);
    
        resp.json(crearTx)
    } catch (error) {
        console.log(error)
    }

    
    // resp.json(crearTx)
}


const validarTbk = async(req, resp) =>{

    const {token} = req.params
    // console.log(token)
    try {
        // const {token} = req.body;
        // console.log(token)
        const response = await tx.commit(token);

        // vci, amount, status, session_id,transaction_date
        if(response.status === 'AUTHORIZED'){
            await conexion.execute(`CALL CREARBOLETA( '${response.status}', '${response.amount}',  '${response.session_id}', '${response.transaction_date}')`)
            const actualizarPago = await conexion.execute(`CALL EDIT_ESTADO_PAGO('${response.session_id}', 'PAGADO')`);
            await conexion.commit();
            resp.json(response);
            return
        }
        await conexion.execute(`CALL CREARBOLETA( '${response.status}', '${response.amount}',  '${response.session_id}', '${response.transaction_date}')`)
        const actualizarPago = await conexion.execute(`CALL EDIT_ESTADO_PAGO('${response.session_id}', 'RECHAZADO')`);
        
        await conexion.commit();
        // resp.json({msg: 'Pago Rechazado'})
        resp.json(response);

    } catch (error) {
        console.log(error)
    }

}



export { 
    iniciarTbk,
    validarTbk
}