/// <reference types="Cypress" />

describe('Primeiro acesso', () => {
  context('resolução 1440 x 900', () => {
    beforeEach(() => {
      cy.viewport(1440, 900);
    });

    it('O botão de primeiro acesso é exibido ao clicar em "Entrar"', () => {
      cy.visit('https://saudemental.impulsogov.org/');

      cy.contains('Entrar').click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .find('.ButtonLight_ButtonLightContainer__w0rNI')
        .should('be.visible')
        .and('have.text', 'PRIMEIRO ACESSO');
    });
  });
});
