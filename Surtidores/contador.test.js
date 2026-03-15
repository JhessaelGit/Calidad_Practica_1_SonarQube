import { incrementarContador, decrementarContador } from './contador.js';

describe("Lógica del contador de autos en fila", () => {
  it("Debe incrementar en 1", () => {
    expect(incrementarContador(0)).toBe(1);
    expect(incrementarContador(5)).toBe(6);
  });

  it("Debe decrementar en 1 si es mayor que 0", () => {
    expect(decrementarContador(3)).toBe(2);
    expect(decrementarContador(1)).toBe(0);
  });
  
  it("No debe decrementar debajo de 0", () => {
    expect(decrementarContador(0)).toBe(0);
    expect(decrementarContador(-1)).toBe(0);
  });
});