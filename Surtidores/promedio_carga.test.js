import { calcularPromedioCarga } from './promedio_carga.js';

describe("Cálculo del promedio de carga de gasolina", () => {
  it("Debe calcular 0 cuando no hay autos", () => {
    expect(calcularPromedioCarga(0)).toBe(0);
  });
  it("Debe calcular correctamente para 1 auto", () => {
    expect(calcularPromedioCarga(1)).toBe(45);
  });
  it("Debe calcular para múltiples autos", () => {
    expect(calcularPromedioCarga(3)).toBe(135);
    expect(calcularPromedioCarga(10)).toBe(450);
  });

});

// =====================================================
// TEST 4 — calcularPromedioCarga
// Módulo: promedio_carga.js
// =====================================================
// TEST 4 — calcularPromedioCarga
// Módulo: promedio_carga.js
// =====================================================

describe('calcularPromedioCarga', () => {
  test('CP4b: calcula el promedio de carga con un contador dado', () => {
    const resultado = calcularPromedioCarga(10);
    expect(typeof resultado).toBe('number');
    expect(resultado).toBeGreaterThanOrEqual(0);
  });
});