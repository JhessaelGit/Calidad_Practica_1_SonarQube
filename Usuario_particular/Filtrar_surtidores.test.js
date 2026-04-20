import { jest } from '@jest/globals';

describe("Filtrar_surtidores", () => {

  let boton;
  let select;

  beforeEach(() => {
    jest.resetModules();
  });

  // 1. todos
  test("filtrar todos", async () => {

    document.body.innerHTML = `
      <select id="opcion-filtrado">
        <option value="todos">todos</option>
      </select>

      <button id="button-filtrar"></button>

      <div class="surtidor"></div>
      <div class="surtidor"></div>
    `;

    await import("./Filtrar_surtidores.js");

    boton = document.querySelector("#button-filtrar");
    select = document.querySelector("#opcion-filtrado");

    select.value = "todos";
    boton.click();

    const surtidores = document.querySelectorAll(".surtidor");

    surtidores.forEach(s => {
      expect(s.style.display).toBe("");
    });
  });

  // 2. disponibles + agotado (se oculta)
  test("filtrar disponibles oculta agotados", async () => {

    document.body.innerHTML = `
      <select id="opcion-filtrado">
        <option value="disponibles">disponibles</option>
      </select>

      <button id="button-filtrar"></button>

      <div class="surtidor">
        <span class="estado-actual agotado"></span>
      </div>
    `;

    await import("./Filtrar_surtidores.js");

    boton = document.querySelector("#button-filtrar");
    select = document.querySelector("#opcion-filtrado");

    select.value = "disponibles";
    boton.click();

    const surtidor = document.querySelector(".surtidor");

    expect(surtidor.style.display).toBe("none");
  });

  // 3. disponibles + disponible (NO se oculta) ← ESTE FALTABA
  test("disponibles no oculta surtidor disponible", async () => {

    document.body.innerHTML = `
      <select id="opcion-filtrado">
        <option value="disponibles">disponibles</option>
      </select>

      <button id="button-filtrar"></button>

      <div class="surtidor">
        <span class="estado-actual disponible"></span>
      </div>
    `;

    await import("./Filtrar_surtidores.js");

    boton = document.querySelector("#button-filtrar");
    select = document.querySelector("#opcion-filtrado");

    select.value = "disponibles";
    boton.click();

    const surtidor = document.querySelector(".surtidor");

    expect(surtidor.style.display).toBe("");
  });

  // 4. sin estado (optional chaining)
  test("surtidor sin estado no rompe", async () => {

    document.body.innerHTML = `
      <select id="opcion-filtrado">
        <option value="disponibles">disponibles</option>
      </select>

      <button id="button-filtrar"></button>

      <div class="surtidor"></div>
    `;

    await import("./Filtrar_surtidores.js");

    boton = document.querySelector("#button-filtrar");
    select = document.querySelector("#opcion-filtrado");

    select.value = "disponibles";

    expect(() => boton.click()).not.toThrow();
  });
  test("valor distinto no ejecuta ningún filtro", async () => {
    document.body.innerHTML = `
        <select id="opcion-filtrado">
        <option value="otro">otro</option>
        </select>

        <button id="button-filtrar"></button>

        <div class="surtidor">
        <span class="estado-actual disponible"></span>
        </div>
    `;

    jest.resetModules();

    await import("./Filtrar_surtidores.js");

    const boton = document.querySelector("#button-filtrar");
    const select = document.querySelector("#opcion-filtrado");

    select.value = "otro";
    boton.click();

    const surtidor = document.querySelector(".surtidor");

    expect(surtidor.style.display).toBe(""); // no cambia
    });

});