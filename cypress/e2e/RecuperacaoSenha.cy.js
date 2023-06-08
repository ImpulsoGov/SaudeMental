/// <reference types="Cypress" />

describe('Recuperação de senha', () => {
  context('resolução 1440 x 900', () => {
    beforeEach(() => {
      cy.viewport(1440, 900);
      cy.visit('https://saudemental.impulsogov.org/');
    });

    it('O botão de entrar é exibido no modal ao clicar no campo ENTRAR na navbar', () => {
      cy.contains(/entrar/i).click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .find('.ButtonColor_ButtonColorContainer__FZdLO')
        .should('be.visible')
        .and('have.text', 'ENTRAR');
    });
  });
});
