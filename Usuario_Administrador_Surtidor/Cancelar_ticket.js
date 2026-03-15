const boton_cancelar=document.querySelector("#cancelar-button")
const codigo_ticket= document.querySelector("#codigo-ticket")

boton_cancelar.addEventListener("click",(event)=>{
    event.preventDefault();
    const codigo_ticket_value=codigo_ticket.value;
    if(codigo_ticket_value === "TK-LJFK5C" && "TK-1PVC3G")
    {
        alert("El Ticket fue cancelado Exitosamente");
    }
    else
    {
        alert("El Ticket No Existe");
    }
})