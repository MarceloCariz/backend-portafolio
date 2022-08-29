

let postulaciones = [];

const postularSubastas = async(req, resp)=>{
    try {
        // const producto = {...req.body}
        postulaciones.push({...req.body})

    
        const productosUniques = postulaciones.reduce((acc, product)=>{
          if(!acc[product.NOMBRE]){
            acc[product.NOMBRE] = []
          }
          acc[product.NOMBRE].push(product)
    
          return acc
        },[]);
        const productosElegidos = []
    
        for(const p in productosUniques){
         
          const minprecio = productosUniques[p].sort((a,b)=>(
            a.PRECIO_EXP - b.PRECIO_EXP
          ))
          productosElegidos.push(minprecio[0])
        }
    

    // setTimeout(() => {
        // const seleccionado = postulaciones.sort((a,b)=> a.precio - b.precio)[0];
        console.log(productosElegidos)
        resp.json(productosElegidos)
        // setTimeout(() => {
        postulaciones = [];
            
        // }, 2000);
        // return
    // }, 20000);

    } catch (error) {
        console.log(error)
    }
};




export {
    postularSubastas
}