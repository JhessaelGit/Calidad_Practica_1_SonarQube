const ticket = JSON.parse(localStorage.getItem("ticketActual"));

if (ticket) {
  document.getElementById("nombre").textContent = ticket.nombre;
  document.getElementById("ubicacion").textContent = ticket.ubicacion;
  document.getElementById("estado").textContent = ticket.estado;
  document.getElementById("codigo").textContent = ticket.codigo;
}
