describe('Teacher student competencies test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
    });

    it('View student competencies dashboard as teacher', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/student-competencies/admin');

        // verify teacher redirect
        cy.location('hash').should('eq', '');

        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
            .contains('Select a list of students and a content area to load enrollments dashboard');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the 'Rubric' selector element
            var rubricSelector = extQuerySelector('slate-cbl-contentareaselector');

            // click the selector
            cy.get('#' + rubricSelector.el.dom.id).click();

            // verify and click first element of picker dropdown
            cy.get('#' + rubricSelector.getPicker().id + ' .x-boundlist-item')
                .contains('English Language Arts')
                .click();

            // verify hash updates
            cy.location('hash').should('eq', '#ELA');

            // get the 'Students' selector element
            var studentSelector = extQuerySelector('slate-cbl-studentslistselector');

            // click the selector
            cy.get('#' + studentSelector.el.dom.id)
                .click()
                .focused()
                .type('ELA');

            // verify and click first element of picker dropdown
            cy.get('#' + studentSelector.getPicker().id + ' .x-boundlist-item')
                .contains('ELA-001')
                .click();

            // verify hash updates
            cy.location('hash').should('eq', '#ELA/section:ELA-001');

            // verify content loads
            cy.get('.slate-studentcompetencies-admin-grid').contains('Student Slate');
        });
    });
});