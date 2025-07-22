describe('NodeModal Edit Button Visibility', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/editor');
  });

  it('finds a node with an editable modal, checks Edit, Save, and Cancel', () => {
    cy.get('g[id^="ref-"][id*="node"] rect', { timeout: 5000 }).each(($rect) => {
      cy.wrap($rect).click();

      cy.get('.mantine-Modal-root').should('be.visible');
      cy.contains('Content').should('exist');

      cy.get('body').then($body => {
        if ($body.find('button:contains("Edit")').length > 0) {
          cy.contains('button', 'Edit').should('exist').click();
          cy.contains('button', 'Save').should('exist');
          cy.contains('button', 'Cancel').should('exist').click(); // Click Cancel after Edit
          cy.get('.m_b5489c3c > .mantine-focus-auto').click();
          return false; // Stop after the first editable node
        } else {
          cy.get('.m_b5489c3c > .mantine-focus-auto').click();
        }
      });
    });
  });
});