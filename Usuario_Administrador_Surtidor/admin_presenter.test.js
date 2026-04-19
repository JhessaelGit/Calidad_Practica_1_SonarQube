import { jest } from '@jest/globals';

describe("admin_presenter", () => {

  beforeEach(() => {
    document.body.innerHTML = `
      <title id="titulo"></title>
      <h1 id="nombre-estacion"></h1>
      <p id="direccion"></p>
      <p id="estado-actual"></p>
      <p id="horario-texto"></p>
      <p id="gasolina-disponible"></p>
    `;

    jest.resetModules();
  });

  test("caso 1: estación existe", async () => {

    // ✔ forma correcta de simular URL
    window.history.pushState({}, "", "/?id=portales");

    jest.unstable_mockModule('../estaciones.js', () => ({
      estaciones: {
        portales: {
          nombre: "Estación Portales",
          direccion: "Av. Siempre Viva",
          estado: "Disponible",
          gasolina: "100L",
          horario: "08:00 - 20:00"
        }
      }
    }));

    await import('../Usuario_Administrador_Surtidor/admin_presenter.js');

    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(document.getElementById("titulo").textContent).toBe("Estación Portales");
    expect(document.getElementById("nombre-estacion").textContent).toBe("Estación Portales");
    expect(document.getElementById("direccion").textContent).toBe("Av. Siempre Viva");
    expect(document.getElementById("estado-actual").textContent).toBe("Disponible");
    expect(document.getElementById("estado-actual").className).toBe("disponible");
    expect(document.getElementById("gasolina-disponible").textContent).toBe("100L");
    expect(document.getElementById("horario-texto").textContent).toBe("08:00 - 20:00");
  });

  test("caso 2: estación NO existe", async () => {

    window.history.pushState({}, "", "/?id=inexistente");

    jest.unstable_mockModule('../estaciones.js', () => ({
      estaciones: {}
    }));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await import('../Usuario_Administrador_Surtidor/admin_presenter.js');

    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(consoleSpy).toHaveBeenCalledWith("Estación no encontrada");

    consoleSpy.mockRestore();
  });

});