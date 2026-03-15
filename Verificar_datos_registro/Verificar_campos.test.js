import {verificar_nombre,verificar_ci, verificar_correo, verificar_contrasenia,verificar_cantidad_gasolina,verificar_surtidor} from "./Verificar_campos";

describe("Pruebas para verificar el nombre",() => {
    it("Si el campo del nombre es una cadena vacia deberia retornar false", () => {
        expect(verificar_nombre("")).toEqual(false)
    })
    it("Si el campo del nombre esta con nombre deveria devolver true", () => {
        expect(verificar_nombre("Jhessael")).toEqual(true)
    })
    it("Si el campo del nombre esta vacio deveria devolver un false", () => {
        expect(verificar_nombre()).toEqual(false)
    })
})

describe("Pruebas para verificar el ci",() => {
    it("Si el campo del ci es una cadena vacia deberia retornar false", () => {
        expect(verificar_ci("")).toEqual(false)
    })
    it("Si el campo del ci esta con un valor deveria devolver true", () => {
        expect(verificar_ci("1234567")).toEqual(true)
    })
    it("Si el campo del ci esta vacio deveria devolver un false", () => {
        expect(verificar_ci()).toEqual(false)
    })
    it("Si el campo del ci tiene un dato que no sean numeros deveria devolver un false", () => {
        expect(verificar_ci("1234n24")).toEqual(false)
    })
    it("Si el campo del ci tiene solo numeros deveria devolver un true", () => {
        expect(verificar_ci("1234334")).toEqual(true)
    })
    it("Si el campo del ci tiene menos o mas de 8 digitos deveria devolver un false", () => {
        expect(verificar_ci("12343")).toEqual(false)
    })
})

describe("Pruebas para verificar el correo",() => {
    it("Si el campo del correo es una cadena vacia deberia retornar false", () => {
        expect(verificar_correo("")).toEqual(false)  
    })
    it("Si el campo del correo esta con un valor deveria devolver true", () => {
        expect(verificar_correo("prueba@gmail.com")).toEqual(true)
    })
    it("Si el campo del correo esta vacio deveria devolver un false", () => {
        expect(verificar_correo()).toEqual(false)
    })
    it("Si el campo del correo no incluye un @ deveria retornar un false", () => {
        expect(verificar_correo("pruebagmail.com")).toEqual(false)
    })
})

describe("Pruebas para verificar la contraseña",() => {
    it("Si el campo del contraseña es una cadena vacia deberia retornar false", () => {
        expect(verificar_contrasenia("")).toEqual(false)  
    })
    it("Si el campo del contraseña esta con un valor deveria devolver true", () => {
        expect(verificar_contrasenia("1234j1234h")).toEqual(true)
    })
    it("Si el campo del contraseña esta vacio deveria devolver un false", () => {
        expect(verificar_contrasenia()).toEqual(false)
    })
})

describe("Pruebas para verificar el surtidor",() => {
    it("Si el campo del surtidor es una cadena vacia deberia retornar false", () => {
        expect(verificar_surtidor("")).toEqual(false)
    })
    it("Si el campo del nombre esta con nombre deveria devolver true", () => {
        expect(verificar_surtidor("El Cristo")).toEqual(true)
    })
        
    }
)


describe("Pruebas para verificar la cantidad de gasolina", () => {
    it("Si el campo del registro de cantidad de gasolina es una cadena vacia deberia retornar false", () => {
        expect(verificar_cantidad_gasolina("")).toBe(false);
    })
    it("Si el campo del registro de cantidad de gasolina esta deberia devolver un false", () => {
        expect(verificar_cantidad_gasolina("12df3")).toEqual(false)
    })
    it("Si campo del registro de cantidad de gasolina tienen solo numeros deberia devolver un true", () => {
        expect(verificar_cantidad_gasolina("1000")).toEqual(true)
    })
})