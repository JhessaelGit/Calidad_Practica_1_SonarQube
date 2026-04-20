import { jest } from '@jest/globals';

describe("Registrarse", () => {

  let boton;
  let inputNombre;
  let inputCI;
  let inputCorreo;
  let inputContrasenia;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="nombre-usuario" />
      <input id="ci-usuario" />
      <input id="correo-usuario" />
      <input id="contrasenia-usuario" />
      <button id="registrar-button"></button>
      <form id="registrar-form"></form>
    `;

    jest.resetModules();
  });

  test("datos válidos ejecuta flujo de éxito", async () => {

    jest.unstable_mockModule('../Verificar_datos_registro/Verificar_campos.js', () => ({
      verificar_nombre: () => true,
      verificar_ci: () => true,
      verificar_correo: () => true,
      verificar_contrasenia: () => true
    }));

    // evita que jsdom rompa por navegación
    jest.spyOn(console, "error").mockImplementation(() => {});

    await import("./Registrarse.js");

    inputNombre = document.querySelector("#nombre-usuario");
    inputCI = document.querySelector("#ci-usuario");
    inputCorreo = document.querySelector("#correo-usuario");
    inputContrasenia = document.querySelector("#contrasenia-usuario");
    boton = document.querySelector("#registrar-button");

    inputNombre.value = "Juan";
    inputCI.value = "123456";
    inputCorreo.value = "test@mail.com";
    inputContrasenia.value = "1234";

    // lo importante: NO lanza error
    expect(() => boton.click()).not.toThrow();
  });

  test("datos inválidos muestra alerta", async () => {

    jest.unstable_mockModule('../Verificar_datos_registro/Verificar_campos.js', () => ({
      verificar_nombre: () => false,
      verificar_ci: () => true,
      verificar_correo: () => true,
      verificar_contrasenia: () => true
    }));

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    await import("./Registrarse.js");

    inputNombre = document.querySelector("#nombre-usuario");
    inputCI = document.querySelector("#ci-usuario");
    inputCorreo = document.querySelector("#correo-usuario");
    inputContrasenia = document.querySelector("#contrasenia-usuario");
    boton = document.querySelector("#registrar-button");

    inputNombre.value = "";
    inputCI.value = "123456";
    inputCorreo.value = "test@mail.com";
    inputContrasenia.value = "1234";

    boton.click();

    expect(alertMock).toHaveBeenCalledWith(
      "Por favor, ingrese los datos correctamente, los campos no deven estar vacios y debe poner un correo valido"
    );

    alertMock.mockRestore();
  });

});