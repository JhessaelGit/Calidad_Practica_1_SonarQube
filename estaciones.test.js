import { estaciones } from './estaciones.js';

describe("estaciones", () => {

  test("existe manantial", () => {
    expect(estaciones.manantial).toBeDefined();
  });

  test("tiene nombre", () => {
    expect(estaciones.manantial.nombre).toBe("E. S. El Manantial");
  });

  test("gasolina es número", () => {
    expect(typeof estaciones.portales.gasolina).toBe("number");
  });

});