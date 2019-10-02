describe('Teacher demonstrations test', () => {

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
                '_LOGIN[username]': 'teacher',
                '_LOGIN[password]': 'teacher',
                '_LOGIN[returnMethod]': 'POST'
            }
        });
    });

    it('View single demonstration rubric as student', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/demonstrations/teacher');

        // verify teacher redirect
        cy.location('hash').should('eq', '#_');
        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder ')
            .contains('Select a list of students and a content area to load progress dashboard');

        cy.window().then((win) => {

            // get the selector element
            var selectorEl = win.Ext.ComponentQuery.query('slate-cbl-contentareaselector')[0];

            // click the selector
            cy.get('#' + selectorEl.el.dom.id).click();

            // verify and click first element of picker dropdown
            cy.get('#' + selectorEl.getPicker().id + ' li:first-child')
                .contains('English Language Arts')
                .click();

            // verify content loads
            cy.get('.slate-demonstrations-student-competenciessummary span').contains('English Language Arts');
        });
    });
});