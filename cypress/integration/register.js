describe('Registration test', () => {

    // reset database before tests
    before(() => {
        cy.dropDatabase();
    });

    it('Register and set up profile', () => {
        cy.visit('/register');

        cy.get('.content')
            .contains('Sorry, self-registration is not currently available. Please contact an administrator.');

    });
});