describe('Teacher demonstrations test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
    });

    it('View single demonstration rubric as teacher', () => {

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