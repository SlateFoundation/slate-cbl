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

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get current tasks list
            var currentTasksTree = extQuerySelector('slate-tasks-student-tasktree');

            // verify content has finished loading
            cy.get('#' + currentTasksTree.id)
                .contains('ELA Task One')

            // get the course section element
            var courseSectionSelector = extQuerySelector('slate-cbl-sectionselector');

            // click the selector
            cy.get('#' + courseSectionSelector.el.dom.id).click();

            // click ELA Studio element of picker dropdown
            cy.get('#' + courseSectionSelector.getPicker().id + ' .x-boundlist-item')
                .contains('ELA Studio')
                .click();

            // verify hash
            cy.location('hash').should('eq', '#me/ELA-001');

            // verify content loads
            cy.get('#' + currentTasksTree.id)
                .contains('ELA Task One')
        });
    });
});