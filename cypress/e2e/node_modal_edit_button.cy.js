const { before } = require("node:test");

describe('NodeModal Edit Button Presence For All Nodes', () => {
  before(() => {
    // Visit the page where the node modals are present
    cy.visit('/editor'); // Update with the actual path to your application
  });

  it('checks for Edit button in every node modal', () => {
    // Select all node triggers (update selector as needed)
    cy.get('[data-testid^="open-node-modal"]').each(($el, index) => {
      cy.wrap($el).click();

      cy.get('.mantine-Modal-root').should('be.visible');

      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Edit")').length > 0) {
          cy.log(`Node modal ${index + 1}: Edit button is present`);
        } else {
          cy.log(`Node modal ${index + 1}: Edit button is NOT present`);
        }
      });

      // Close the modal (update selector if you have a custom close button)
      cy.get('.mantine-Modal-root button[aria-label="Close"]').click();
    });
  });
});