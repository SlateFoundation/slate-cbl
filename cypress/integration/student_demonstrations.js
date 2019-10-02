describe('Student demonstrations test', () => {

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

    it('View single dempnstration rubric as student', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/demonstrations/student');

        // verify student redirect
        cy.location('hash').should('eq', '#me');
        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder ')
            .contains('Select a content area to load demonstrations dashboard');

        cy.window().then((win) => {

            // het the selector element
            var selectorEl = win.Ext.ComponentQuery.query('slate-cbl-contentareaselector')[0];

            // click the selector
            cy.get('#' + selectorEl.el.dom.id).click();

            // get the picker element
            var pickerEl = selectorEl.getPicker();

            // verify and click first element of selector dropdown
            cy.get('#' + pickerEl.id + ' li:first-child')
                .contains('English Language Arts')
                .click();

            // verify content loads
            cy.get('.slate-demonstrations-student-competenciessummary span').contains('English Language Arts');
        });
    });
});