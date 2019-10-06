describe('Student tasks test', () => {

    // load sample database before tests
    before(() => {
        const studioContainer = Cypress.env('STUDIO_CONTAINER');

        if (studioContainer) {
            cy.exec(`echo 'DROP DATABASE IF EXISTS \`default\`; CREATE DATABASE \`default\`;' | docker exec -i ${studioContainer} hab pkg exec core/mysql mysql -u root -h 127.0.0.1`);
            cy.exec(`cat .data/fixtures/*.sql | docker exec -i ${studioContainer} hab pkg exec core/mysql mysql -u root -h 127.0.0.1 default`);
        }
    });

    // authenticate as 'student' user
    beforeEach(() => {
        cy.visit('/');
        cy.request({
            method: 'POST',
            url: '/login/?format=json',
            form: true,
            body: {
                '_LOGIN[username]': 'student',
                '_LOGIN[password]': 'student',
                '_LOGIN[returnMethod]': 'POST'
            }
        });
    });

    it('View single task as student', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/student');

        // verify student redirect
        cy.location('hash').should('eq', '#me/all');

        // TODO - check for page content
    });
});