function verificarDisponibilidad(estado) {
    return estado === "Disponible";
}


function generarCodigo() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = 'TK-';
    for (let i = 0; i < 6; i++) {
      codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
  }
  
  function generarTicket({nombre, ubicacion, estado}) {
    return {
      nombre,
      ubicacion,
      estado,
      codigo: generarCodigo()
    };
  }
  
  

export {verificarDisponibilidad,generarTicket};

  