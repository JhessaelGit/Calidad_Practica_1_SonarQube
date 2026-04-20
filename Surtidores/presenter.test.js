import { jest } from '@jest/globals';

describe("presenter.js coverage (Grafo Ciclomático)", () => {

  const setupDOM = () => {
    document.body.innerHTML = `
      <title id="titulo"></title>
      <h1 id="nombre-estacion"></h1>
      <p id="direccion"></p>
      <p id="estado-actual"></p>
      <p id="horario-texto"></p>
      <div id="gasolina"></div>
      <p id="estado-horario"></p>
      <span id="contador-fila"></span>
      <button id="btn-ingresar-fila"></button>
      <button id="btn-salir-fila"></button>
      <button id="calcular-carga-promedio-button"></button>
      <span id="promedio-gasolina"></span>
      <button id="btn-ticket"></button>
    `;
  };

  beforeEach(() => {
    setupDOM();

    globalThis.alert = jest.fn();
    globalThis.open = jest.fn();
    
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (k) => store[k] ?? null,
        setItem: (k, v) => { store[k] = String(v); },
        clear: () => { store = {}; }
      };
    })();
    Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, configurable: true, writable: true });

    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Ruta: No existe estación (B -> D)", async () => {
    history.pushState({}, '', '?id=inexistente');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await import('../Surtidores/presenter.js');
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(consoleSpy).toHaveBeenCalledWith("Estación no encontrada");
    expect(document.querySelector("h1").textContent).toBe(""); // DOM wasn't modified
    consoleSpy.mockRestore();
  });

  test("Ruta: Existe estación Agotado, boton ticket alerta (B -> C -> E -> I -> J -> K -> M)", async () => {
    history.pushState({}, '', '?id=manantial'); // manantial es 'Agotado'
    
    await import('../Surtidores/presenter.js');
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(document.querySelector("h1").textContent).toBe("E. S. El Manantial");
    expect(document.getElementById("estado-actual").className).toBe("agotado");

    // Click ticket
    document.getElementById("btn-ticket").click();
    expect(globalThis.alert).toHaveBeenCalledWith("Este surtidor no tiene combustible. Por favor, elige otro.");
    expect(globalThis.open).not.toHaveBeenCalled();
  });

  test("Ruta: Existe estación Disponible, boton ticket redirige (I -> J -> L -> M)", async () => {
    history.pushState({}, '', '?id=portales'); // portales es 'Disponible'
    
    await import('../Surtidores/presenter.js');
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(document.getElementById("estado-actual").className).toBe("disponible");

    // Click ticket
    document.getElementById("btn-ticket").click();
    expect(globalThis.alert).not.toHaveBeenCalled();
    expect(globalThis.localStorage.getItem("ticketActual")).not.toBeNull();
    expect(globalThis.open).toHaveBeenCalledWith("ticket.html", "_self");
  });

  test("Ruta: Contador Fila y Promedio Carga (M -> Z)", async () => {
    history.pushState({}, '', '?id=portales'); 
    
    await import('../Surtidores/presenter.js');
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const btnIngresar = document.getElementById("btn-ingresar-fila");
    const btnSalir = document.getElementById("btn-salir-fila");
    const btnPromedio = document.getElementById("calcular-carga-promedio-button");
    const contador = document.getElementById("contador-fila");
    const promedio = document.getElementById("promedio-gasolina");

    // Iniciar
    expect(contador.textContent).toBe("0");

    // Incrementar
    btnIngresar.click();
    expect(contador.textContent).toBe("1");
    btnIngresar.click();
    expect(contador.textContent).toBe("2");

    // Decrementar
    btnSalir.click();
    expect(contador.textContent).toBe("1");

    // Calcular promedio
    btnPromedio.click();
    expect(promedio.textContent).toBe("45"); // 1 auto * 45L
  });

  test("Ruta: Comprobación de horario abierto", async () => {
    history.pushState({}, '', '?id=portales'); 
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-19T10:00:00')); // 10 AM (abierto)
    
    await import('../Surtidores/presenter.js');
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(document.getElementById("estado-horario").textContent).toBe("Actualmente abierto");
    jest.useRealTimers();
  });

  test("Ruta: Comprobación de horario cerrado", async () => {
    history.pushState({}, '', '?id=portales'); 
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-19T03:00:00')); // 3 AM (cerrado)
    
    await import('../Surtidores/presenter.js');
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(document.getElementById("estado-horario").textContent).toBe("Actualmente cerrado");
    jest.useRealTimers();
  });

});