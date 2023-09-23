describe('Verify the menu navigation links on the landing screen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); 
  });

  it('Check for Discord link', () => {
    cy.fixture('navigationLinks.json').then((menuLinks) => {
      cy.findByRole('link', { name: /discord/i })
        .should('exist')
        .and('have.attr', 'href', menuLinks.discord);
    });
  });

  it('Check for Docs link', () => {
    cy.fixture('navigationLinks.json').then((menuLinks) => {
      cy.findByRole('link', { name: /docs/i })
        .should('exist')
        .and('have.attr', 'href', menuLinks.docs);
    });
  });

  it('Check for Github link', () => {
    cy.fixture('navigationLinks.json').then((menuLinks) => {
      cy.findByRole('link', { name: /github/i })
        .should('exist')
        .and('have.attr', 'href', menuLinks.github);
    });
  });
});
