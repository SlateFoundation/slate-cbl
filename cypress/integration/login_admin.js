describe('Admin login test', () => {
    it('Visit the homepage', () => {
        cy.visit('http://localhost:7080/');

        cy.contains('Log In').click();
        cy.location('pathname').should('eq', '/login');
        cy.location('search').should('eq', '?return=%2F');

        cy.focused()
            .should('have.attr', 'name', '_LOGIN[username]')
            .type('admin')
            .tab();

        cy.focused()
            .should('have.attr', 'name', '_LOGIN[password]')
            .type('admin{enter}');

            cy.location('pathname').should('eq', '/');
        });
});