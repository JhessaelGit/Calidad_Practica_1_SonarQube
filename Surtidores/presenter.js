import { esta_dentro_horario } from './surtidores.js';
import { generarTicket } from './ticket.js';
import { incrementarContador, decrementarContador } from './contador.js';
import { calcularPromedioCarga } from './promedio_carga.js';

//  DATOS DE ESTACIONES
import { estaciones } from "../estaciones.js";

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  //  CARGA DINÁMICA
  // =========================
  const params = new URLSearchParams(window.location.search);
  const key = params.get("id");
  const estacion = estaciones[key];

  if (!estacion) {
    console.error("Estación no encontrada");
    return;
  }

  //  actualizar HTML dinámicamente
  document.querySelector("title").textContent = estacion.nombre;
  document.querySelector("h1").textContent = estacion.nombre;
  document.getElementById("direccion").textContent = estacion.direccion;

  const estadoElemento = document.getElementById("estado-actual");
  estadoElemento.textContent = estacion.estado;

  // clase visual (opcional)
  estadoElemento.className = estacion.estado === "Agotado" ? "agotado" : "disponible";

  document.getElementById("gasolina").textContent = estacion.gasolina;
  document.getElementById("horario-texto").textContent = estacion.horario;

  // =========================
  // 🔹 HORARIO
  // =========================
  const estadoHorario = document.getElementById("estado-horario");

  function mostrar_horario_Actual() {
    const horaActual = new Date().getHours();

    if (esta_dentro_horario(horaActual)) {
      estadoHorario.textContent = "Actualmente abierto";
    } else {
      estadoHorario.textContent = "Actualmente cerrado";
    }
  }

  mostrar_horario_Actual();
  setInterval(mostrar_horario_Actual, 60000);

  // =========================
  //  TICKET
  // =========================
  const botonTicket = document.getElementById("btn-ticket");

  if (botonTicket) {
    botonTicket.addEventListener("click", () => {

      if (estacion.estado === "Agotado") {
        alert("Este surtidor no tiene combustible. Por favor, elige otro.");
        return;
      }

      const ticket = generarTicket({
        nombre: estacion.nombre,
        ubicacion: estacion.direccion,
        estado: estacion.estado
      });

      localStorage.setItem("ticketActual", JSON.stringify(ticket));
      window.location.href = "ticket.html";
    });
  }

  // =========================
  //  CONTADOR DE FILA
  // =========================
  const nombreSurtidor = estacion.nombre;
  const keyContador = `contadorFila-${nombreSurtidor.replaceAll(/\s+/g, '_')}`;

  const contadorElemento = document.getElementById("contador-fila");
  const btnIngresar = document.getElementById("btn-ingresar-fila");
  const btnSalir = document.getElementById("btn-salir-fila");

  let contador = 0;
  if (contadorElemento) contadorElemento.textContent = contador;
  localStorage.setItem(keyContador, contador);

  function actualizarContador(valor) {
    if (valor === 1) {
      contador = incrementarContador(contador);
    } else if (valor === -1) {
      contador = decrementarContador(contador);
    }

    if (contadorElemento) contadorElemento.textContent = contador;
    localStorage.setItem(keyContador, contador);
  }

  btnIngresar?.addEventListener("click", () => actualizarContador(1));
  btnSalir?.addEventListener("click", () => actualizarContador(-1));

  // =========================
  //  PROMEDIO DE CARGA
  // =========================
  const btnCalcularPromedio = document.getElementById("calcular-carga-promedio-button");
  const promedioElemento = document.getElementById("promedio-gasolina");

  function actualizarPromedioCarga() {
    if (promedioElemento) {
      const promedio = calcularPromedioCarga(contador);
      promedioElemento.textContent = promedio;
    }
  }

  btnCalcularPromedio?.addEventListener("click", actualizarPromedioCarga);

});