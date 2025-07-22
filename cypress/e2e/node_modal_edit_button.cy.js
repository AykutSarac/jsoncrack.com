describe('NodeModal Edit Button Visibility', () => {
  let editCount = 0;
  let saveCount = 0;
  let cancelCount = 0;

  beforeEach(() => {
    cy.visit('http://localhost:3000/editor');
  });

  it('finds nodes with editable modals and counts Edit, Save, Cancel buttons', () => {
    cy.get('g[id^="ref-"][id*="node"] rect', { timeout: 5000 }).each(($rect, index, $list) => {
      cy.wrap($rect).click();

      cy.get('.mantine-Modal-root').should('be.visible');
      cy.contains('Content').should('exist');

      cy.get('body').then($body => {
        const editButton = $body.find('button:contains("Edit")');
        if (editButton.length > 0) {
          editCount++;
          cy.contains('button', 'Edit').click();
          cy.contains('button', 'Save').should('exist');
          cy.contains('button', 'Cancel').should('exist');
          saveCount++;
          cancelCount++;

          cy.contains('button', 'Cancel').click();
          cy.get('.m_b5489c3c > .mantine-focus-auto').click();
          return false; // Stop after first editable node
        } else {
          cy.get('.m_b5489c3c > .mantine-focus-auto').click();
        }
      });
    }).then(() => {
      cy.log(`✅ Found Edit buttons: ${editCount}`);
      cy.log(`✅ Found Save buttons: ${saveCount}`);
      cy.log(`✅ Found Cancel buttons: ${cancelCount}`);
      console.log(`Edit: ${editCount}, Save: ${saveCount}, Cancel: ${cancelCount}`);
    });
  });
});
