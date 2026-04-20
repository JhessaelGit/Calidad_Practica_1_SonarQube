// =====================================================
// TEST 3 (CP6 y CP7) — incrementarContador / decrementarContador
// Módulo: contador.js
// =====================================================
import { incrementarContador, decrementarContador } from './contador.js';

describe('contador', () => {
  test('CP6: valor=1 → incrementarContador aumenta en 1', () => {
    expect(incrementarContador(0)).toBe(1);
    expect(incrementarContador(5)).toBe(6);
  });

  test('CP7: valor=-1 → decrementarContador no baja de 0', () => {
    expect(decrementarContador(3)).toBe(2);
    expect(decrementarContador(0)).toBe(0); // no puede ser negativo
  });
});