import { jest } from '@jest/globals';

describe("Cancelar_ticket", () => {

    let boton;
    let input;
    let alertMock;

    beforeEach(async () => {
        document.body.innerHTML = `
            <input id="codigo-ticket" />
            <button id="cancelar-button"></button>
        `;

        alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

        await import("./Cancelar_ticket.js");

        boton = document.querySelector("#cancelar-button");
        input = document.querySelector("#codigo-ticket");
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("Ticket válido TK-LJFK5C", () => {
        input.value = "TK-LJFK5C";
        boton.click();

        expect(alertMock).toHaveBeenCalledWith("El Ticket fue cancelado Exitosamente");
    });

    test("Ticket válido TK-1PVC3G", () => {
        input.value = "TK-1PVC3G";
        boton.click();

        expect(alertMock).toHaveBeenCalledWith("El Ticket fue cancelado Exitosamente");
    });

    test("Ticket inválido", () => {
        input.value = "TK-XXXXXX";
        boton.click();

        expect(alertMock).toHaveBeenCalledWith("El Ticket No Existe");
    });

});