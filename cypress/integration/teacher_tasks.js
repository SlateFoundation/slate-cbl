describe('Teacher demonstrations test', () => {

    // load sample database before tests
    before(() => {
        const studioContainer = Cypress.env('STUDIO_CONTAINER');

        if (studioContainer) {
            cy.exec(`echo 'DROP DATABASE IF EXISTS \`default\`; CREATE DATABASE \`default\`;' | docker exec -i ${studioContainer} hab pkg exec core/mysql mysql -u root -h 127.0.0.1`);
            cy.exec(`cat .data/fixtures/*.sql | docker exec -i ${studioContainer} hab pkg exec core/mysql mysql -u root -h 127.0.0.1 default`);
        }
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