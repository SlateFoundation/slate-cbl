describe('Student tasks test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'student' user
    beforeEach(() => {
        cy.loginAs('student');
    });

    it('View single task as student', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/student');

        // verify student redirect
        cy.location('hash').should('eq', '#me/all');

        // TODO - check for page content
    });
});