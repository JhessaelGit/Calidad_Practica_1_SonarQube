const horarioApertura = 8;  // 8 AM
const horarioCierre = 22;   // 10 PM

function esta_dentro_horario(horaActual) {
    return horaActual >= horarioApertura && horaActual < horarioCierre;
}

export {esta_dentro_horario};