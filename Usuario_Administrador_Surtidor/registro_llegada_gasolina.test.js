import { jest } from '@jest/globals';

describe("registro_llegada_gasolina", () => {

  let input;
  let boton;
  let gasolina;
  let estado;

  beforeEach(async () => {
    document.body.innerHTML = `
      <input id="cantidad-gasolina" />
      <button id="registrar-llegada-gasolina-button"></button>
      <form id="registrar-llegada-gasolina-form"></form>
      <p id="gasolina-disponible"></p>
      <p id="estado-actual" class="disponible"></p>
    `;

    jest.resetModules();
  });

  test("datos inválidos", async () => {

    jest.unstable_mockModule('../Verificar_datos_registro/Verificar_campos.js', () => ({
      verificar_cantidad_gasolina: () => false
    }));

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    await import('../Usuario_Administrador_Surtidor/registro_llegada_gasolina.js');

    input = document.querySelector("#cantidad-gasolina");
    boton = document.querySelector("#registrar-llegada-gasolina-button");

    input.value = "abc";
    boton.click();

    expect(alertMock).toHaveBeenCalledWith(
      "Por favor, ingrese los datos de llegada de gasolina correctamente"
    );
  });

  test("válido menor a 100 → Agotado", async () => {

    jest.unstable_mockModule('../Verificar_datos_registro/Verificar_campos.js', () => ({
      verificar_cantidad_gasolina: () => true
    }));

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    await import('../Usuario_Administrador_Surtidor/registro_llegada_gasolina.js');

    input = document.querySelector("#cantidad-gasolina");
    boton = document.querySelector("#registrar-llegada-gasolina-button");
    gasolina = document.querySelector("#gasolina-disponible");
    estado = document.querySelector("#estado-actual");

    input.value = "50";
    boton.click();

    expect(gasolina.textContent).toBe("50");
    expect(estado.textContent).toBe("Agotado");
    expect(estado.classList.contains("agotado")).toBe(true);
  });

  test("válido mayor o igual a 100 → Disponible", async () => {

    jest.unstable_mockModule('../Verificar_datos_registro/Verificar_campos.js', () => ({
      verificar_cantidad_gasolina: () => true
    }));

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    await import('../Usuario_Administrador_Surtidor/registro_llegada_gasolina.js');

    input = document.querySelector("#cantidad-gasolina");
    boton = document.querySelector("#registrar-llegada-gasolina-button");
    gasolina = document.querySelector("#gasolina-disponible");
    estado = document.querySelector("#estado-actual");

    input.value = "150";
    boton.click();

    expect(gasolina.textContent).toBe("150");
    expect(estado.textContent).toBe("Disponible");
    expect(estado.classList.contains("disponible")).toBe(true);
  });

});