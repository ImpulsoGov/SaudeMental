/// <reference types="Cypress" />

describe('Primeiro acesso', () => {
  context('resolução 1440 x 900', () => {
    beforeEach(() => {
      cy.viewport(1440, 900);
      cy.visit('https://saudemental.impulsogov.org/');
    });

    it('O botão de primeiro acesso é exibido ao clicar em ENTRAR', () => {
      cy.contains(/entrar/i).click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .find('.ButtonLight_ButtonLightContainer__w0rNI')
        .should('be.visible')
        .and('have.text', 'PRIMEIRO ACESSO');
    });

    it('É exibida a input de email ao clicar no botão de PRIMEIRO ACESSO', () => {
      cy.contains(/entrar/i).click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .find('.ButtonLight_ButtonLightContainer__w0rNI')
        .click();

      cy.get('input[placeholder*="E-mail"]').should('be.visible');
    });

    it('É exibido o botão VOLTAR ao clicar no botão de PRIMEIRO ACESSO', () => {
      cy.contains(/entrar/i).click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .find('.ButtonLight_ButtonLightContainer__w0rNI')
        .click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .contains(/voltar/i)
        .should('be.visible');
      // .and('be.enabled');
    });

    it('É exibido o botão PRÓXIMO ao clicar no botão de PRIMEIRO ACESSO', () => {
      cy.contains(/entrar/i).click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .find('.ButtonLight_ButtonLightContainer__w0rNI')
        .click();

      cy.get('.NavBar_NavBarModalContainer__tePj9')
        .contains(/próximo/i)
        .should('be.visible');
      // .and('be.disabled');
    });
  });
});
