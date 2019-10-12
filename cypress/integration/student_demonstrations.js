describe('Student demonstrations test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'student' user
    beforeEach(() => {
        cy.loginAs('student');
    });

    it('View single demonstration rubric as student', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/demonstrations/student');

        // verify student redirect
        cy.location('hash').should('eq', '#me');
        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
            .contains('Select a content area to load demonstrations dashboard');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the selector element
            var contentAreaSelector = extQuerySelector('slate-cbl-contentareaselector');

            // click the selector
            cy.get('#' + contentAreaSelector.el.dom.id).click();

            // verify and click first element of picker dropdown
            cy.get('#' + contentAreaSelector.getPicker().id + ' li:first-child')
                .contains('English Language Arts')
                .click();

            // verify content loads
            cy.get('.slate-demonstrations-student-competenciessummary span').contains('English Language Arts');
        });
    });
});