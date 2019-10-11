describe('Teacher demonstrations test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
    });

    it('View single tasks as teacher', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/teacher');

        // verify teacher redirect
        cy.location('hash').should('eq', '');

        // TODO - check for page content
    });
});