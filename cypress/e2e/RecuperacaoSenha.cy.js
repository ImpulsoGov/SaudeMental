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

    it('É exibido o texto "Esqueceu sua senha?" ao clicar no botão ENTRAR do modal', () => {
      cy.contains(/entrar/i).click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .find('.ButtonColor_ButtonColorContainer__FZdLO')
        .click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .contains(/esqueceu sua senha\?/i)
        .should('be.visible');
    });

    it('É exibido o título "Recuperação de senha" ao clicar no campo "Esqueceu sua senha?"', () => {
      cy.contains(/entrar/i).click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .find('.ButtonColor_ButtonColorContainer__FZdLO')
        .click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .contains(/esqueceu sua senha\?/i)
        .click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .contains('Recuperação de senha')
        .should('be.visible');
    });

    it('É exibida a input de email ao clicar no campo "Esqueceu sua senha?"', () => {
      cy.contains(/entrar/i).click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .find('.ButtonColor_ButtonColorContainer__FZdLO')
        .click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .contains(/esqueceu sua senha\?/i)
        .click();

      cy.get('input[placeholder*="E-mail"]').should('be.visible');
    });

    it('É exibido o botão VOLTAR ao clicar no campo "Esqueceu sua senha?"', () => {
      cy.contains(/entrar/i).click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .find('.ButtonColor_ButtonColorContainer__FZdLO')
        .click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .contains(/esqueceu sua senha\?/i)
        .click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .contains(/voltar/i)
        .should('be.visible');
      // .and('be.enabled');
    });
  });
});
