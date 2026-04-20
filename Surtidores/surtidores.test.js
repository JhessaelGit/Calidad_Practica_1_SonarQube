// =====================================================
// TEST 1 (CP1) — esta_dentro_horario
// Módulo: surtidores.js
// =====================================================
import { esta_dentro_horario } from './surtidores.js';

describe('esta_dentro_horario', () => {
    test('CP1a: devuelve true cuando la hora está dentro del horario', () => {
        expect(esta_dentro_horario(10)).toBe(true);
    });

    test('CP1b: devuelve false cuando la hora está fuera del horario', () => {
        expect(esta_dentro_horario(3)).toBe(false);
    });
});