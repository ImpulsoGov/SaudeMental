/// <reference types="Cypress" />

describe('Primeiro acesso', () => {
  context('resolução 1440 x 900', () => {
    beforeEach(() => {
      cy.viewport(1440, 900);
    });

    it('O botão de primeiro acesso é exibido ao clicar em "Entrar"', () => {
      cy.visit('https://saudemental.impulsogov.org/');

      cy.contains('Entrar').click();

      cy.get('button')
        .contains('PRIMEIRO ACESSO', { matchCase: true })
        .debug()
        .should('be.visible');
    });
  });
});
