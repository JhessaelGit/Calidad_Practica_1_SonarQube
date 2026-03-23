function verificarDisponibilidad(estado) {
  return estado === "Disponible";
}

function generarCodigo() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = 'TK-';
  const array = new Uint32Array(6);
  crypto.getRandomValues(array);

  for (let i = 0; i < 6; i++) {
    codigo += chars[array[i] % chars.length];
  }

  return codigo;
}

function generarTicket({ nombre, ubicacion, estado }) {
  return {
    nombre,
    ubicacion,
    estado,
    codigo: generarCodigo()
  };
}

export { verificarDisponibilidad, generarTicket };