

let postulaciones = [];

const postularSubastas = async(req, resp)=>{
    try {
    postulaciones = [...postulaciones, req.body];
    console.log(postulaciones)

    setTimeout(() => {
        const seleccionado = postulaciones.sort((a,b)=> a.precio - b.precio)[0];
        console.log(seleccionado)
        resp.json(seleccionado)
        setTimeout(() => {
            postulaciones = [];
        }, 2000);
        return
    }, 20000);

    } catch (error) {
        console.log(error)
    }
};




export {
    postularSubastas
}