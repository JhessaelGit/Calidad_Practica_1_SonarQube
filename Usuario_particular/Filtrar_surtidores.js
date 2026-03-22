const boton_filtro = document.querySelector('#button-filtrar')
const surtidores = document.querySelectorAll('.surtidor');
const opcion_filtrado= document.querySelector("#opcion-filtrado")
function filtrar(valor){
    if(valor === 'todos')
    {    
        surtidores.forEach(surtidor => {
            surtidor.style.display = ''; 
        });
    }
    else if(valor === 'disponibles'){
        surtidores.forEach(surtidor => {
            const estado = surtidor.querySelector('.estado-actual');
            if (estado?.classList.contains('agotado')) {
                surtidor.style.display = 'none'; 
            }
        });
    }
}
boton_filtro.addEventListener('click',() =>{
    const opcion_filtrado_value = opcion_filtrado.value; 
    filtrar(opcion_filtrado_value);
})
