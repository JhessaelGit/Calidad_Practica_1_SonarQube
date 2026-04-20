import { jest } from '@jest/globals';

describe("RegistroAdmin", () => {

  let boton;

  beforeEach(async () => {
    document.body.innerHTML = `
      <input id="nombre_usuario_admin" />
      <input id="id_admin" />
      <input id="correo-institucional" />
      <input id="contrasenia-admin" />
      <input id="surtidor" />
      <button id="regostrar-button"></button>
    `;

    jest.resetModules();

    await import("./RegistroAdmin.js");

    boton = document.querySelector("#regostrar-button");
  });

  test("ejecuta submit y previene comportamiento por defecto", () => {

    const event = new Event("submit");
    event.preventDefault = jest.fn();

    boton.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

});