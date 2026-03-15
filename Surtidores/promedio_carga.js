const LITROS_POR_AUTO = 45;

function calcularPromedioCarga(autosEnFila) {
    
  return Math.max(0, autosEnFila) * LITROS_POR_AUTO;
}
export { calcularPromedioCarga };