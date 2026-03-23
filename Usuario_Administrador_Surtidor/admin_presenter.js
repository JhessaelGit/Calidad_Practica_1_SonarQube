import { estaciones } from "../estaciones.js";
  
  document.addEventListener("DOMContentLoaded", () => {
  
    const params = new URLSearchParams(window.location.search);
    const key = params.get("id");
    const estacion = estaciones[key];
  
    if (!estacion) {
      console.error("Estación no encontrada");
      return;
    }
  

    document.getElementById("titulo").textContent = estacion.nombre;
    document.getElementById("nombre-estacion").textContent = estacion.nombre;
    document.getElementById("direccion").textContent = estacion.direccion;
  
    const estado = document.getElementById("estado-actual");
    estado.textContent = estacion.estado;
    estado.className = estacion.estado === "Agotado" ? "agotado" : "disponible";
  
    document.getElementById("gasolina-disponible").textContent = estacion.gasolina;
    document.getElementById("horario-texto").textContent = estacion.horario;
  });