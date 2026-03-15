function incrementarContador(valorActual) {
  return valorActual + 1;
}

function decrementarContador(valorActual) {
  return Math.max(0, valorActual - 1);
}

export { incrementarContador, decrementarContador };