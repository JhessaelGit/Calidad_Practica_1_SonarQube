describe('Filtrado de surtidores disponibles', () => {
  it('Muestra solo los surtidores disponibles al filtrar', () => {
    cy.visit('/');

    cy.get('#nombre-usuario').type('Juan Pérez');
    cy.get('#ci-usuario').type('1234567');
    cy.get('#correo-usuario').type('juan@example.com');
    cy.get('#contrasenia-usuario').type('secreta123');

    cy.get('#registrar-button').click();
    cy.get('#opcion-filtrado').select('disponibles');

    cy.get('#button-filtrar').click();

    cy.get('.surtidor').each(($surtidor) => {
      const estado = $surtidor.find('label#estado-actual');
      if (Cypress.$(estado).is(':visible')) {
        expect(estado).to.have.class('disponible');
      }
    });

    cy.get('label#estado-actual:visible').each(($el) => {
      expect($el).to.have.class('disponible');
    });
  });
});
