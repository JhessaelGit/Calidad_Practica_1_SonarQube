const boton_filtro = document.querySelector('#button-filtrar')
const surtidores = document.querySelectorAll('.surtidor');
const opcion_filtrado= document.querySelector("#opcion-filtrado")

boton_filtro.addEventListener('click',() =>{
    const opcion_filtrado_value = opcion_filtrado.value; 
    function filtrar(valor){
        if(valor === 'todos')
        {    
            surtidores.forEach(surtidor => {
                surtidor.style.display = ''; 
            });
        }
        else if(valor === 'disponibles'){
            surtidores.forEach(surtidor => {
                const estado = surtidor.querySelector('label');

                if (estado && estado.classList.contains('agotado')) {
                    surtidor.style.display = 'none'; 
                }
            });
        }
    }
    filtrar(opcion_filtrado_value);
})
