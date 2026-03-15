describe('Solicitar ticket', () => {
  it('Flujo completo: registro, selección de surtidor y solicitar ticket', () => {
    // 1. Ir a la página de registro
    cy.visit('/');

    // 2. Llenar el formulario
    cy.get('#nombre-usuario').type('Juan Pérez');
    cy.get('#ci-usuario').type('1234567');
    cy.get('#correo-usuario').type('juan@example.com');
    cy.get('#contrasenia-usuario').type('secreta123');
    // 3. Hacer clic en el botón de registro
    cy.get('#registrar-button').click();
    cy.wait(1000);
    //4. Verificar que se redirige a la página de surtidores
    cy.url().should('include', '/lista_surtidores.html');
    cy.wait(1000);
    //5. Dar click en el primer surtidor disponible
    cy.get('.surtidor').filter(':has(label#estado-actual.disponible)').first().find('button').click();
    cy.wait(1000);
    //6. Hacer click en el botón "Solicitar Ticket"
    cy.get('#btn-ticket').click();
  });
});
