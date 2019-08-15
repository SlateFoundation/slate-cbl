describe('Admin login test', () => {
    it('Should toggle login modal display', () => {
        cy.visit('http://localhost:7080/');

        // should be visible after Log In click
        cy.get('#login-modal').should('not.be.visible');
        cy.contains('Log In').click();
        cy.get('#login-modal').should('be.visible');

        // Should be hidden after cancel click
        cy.get('#login-modal').contains('Cancel').click();
        cy.get('#login-modal').should('not.be.visible');

        // Should be hidden after X click
        cy.contains('Log In').click();
        cy.get('#login-modal').should('be.visible');
        cy.get('.modal-close-button').click();
        cy.get('#login-modal').should('not.be.visible');
    });

    it('Should login via Modal', () => {
        cy.visit('http://localhost:7080/');

        cy.get('#login-modal').should('not.be.visible');
        cy.contains('Log In').click();

        cy.contains('#login-modal').should('not.have.attr', 'display');
        cy.focused()
            .should('have.attr', 'name', '_LOGIN[username]')
            .type('admin')
            .tab();

        cy.focused()
            .should('have.attr', 'name', '_LOGIN[password]')
            .type('admin{enter}');

        cy.location('pathname').should('eq', '/');
    });

    it('Should show login error notification', () => {
        cy.visit('http://localhost:7080/');

        cy.get('#login-modal').should('not.be.visible');
        cy.contains('Log In').click();

        cy.focused()
            .should('have.attr', 'name', '_LOGIN[username]')
            .type('admin')
            .tab();

        cy.focused()
            .should('have.attr', 'name', '_LOGIN[password]')
            .type('incorrectpassword{enter}');

        cy.contains('Sorry!')
            .parents('div')
            .should('have.attr', 'class', 'notify error');
    });
});