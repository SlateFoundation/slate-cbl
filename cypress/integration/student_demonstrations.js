describe('Student demonstrations test', () => {

    // load sample database before tests
    before(() => {
        const studioContainer = Cypress.env('STUDIO_CONTAINER');

        if (studioContainer) {
            cy.exec(`echo 'DROP DATABASE IF EXISTS \`default\`; CREATE DATABASE \`default\`;' | docker exec -i ${studioContainer} hab pkg exec core/mysql mysql -u root -h 127.0.0.1`);
            cy.exec(`cat .data/fixtures/*.sql | docker exec -i ${studioContainer} hab pkg exec core/mysql mysql -u root -h 127.0.0.1 default`);
        }
    });

    it('View single dempnstration rubric as student', () => {

        // Open homepage and login as 'student' via modal
        cy.visit('http://localhost:7080/');

        cy.get('#login-modal').should('not.be.visible');
        cy.contains('Log In').click();

        cy.contains('#login-modal').should('not.have.attr', 'display');
        cy.focused()
            .should('have.attr', 'name', '_LOGIN[username]')
            .type('student')
            .tab();

        cy.focused()
            .should('have.attr', 'name', '_LOGIN[password]')
            .type('student{enter}');

        // Verify login sucessful
        cy.location('pathname').should('eq', '/');
        cy.get('.slate-omnibar ul.omnibar-items .omnibar-item:nth-child(5n) a').contains('Student');

        // Open student demonstrations dashboard
        cy.visit('http://localhost:7080/cbl/dashboards/demonstrations/student');

        // Verify student redirect
        cy.location('hash').should('eq', '#me');
        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder ')
            .contains('Select a content area to load demonstrations dashboard');

        // Click into 'Rubric' selector
        cy.get('.slate-cbl-contentareaselector .x-form-arrow-trigger').then(($el) => {

            // Get the id of the core selector element
            var selectorId = $el[0].id.replace('-trigger-picker', '');

            // Open the selector
            $el.click();

            // Verify and click first element of selector dropdown
            cy.get('#' + selectorId + '-picker-listEl li:first-child')
                .contains('English Language Arts')
                .click();

            // Verify content loads
            cy.get('.slate-demonstrations-student-competenciessummary span').contains('English Language Arts');
        });
    });
});