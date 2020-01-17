describe('Teacher tasks test', () => {

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

        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
            .contains('Select a section to load tasks dashboard');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the selector element
            var sectionSelector = extQuerySelector('slate-cbl-sectionselector');

            // click the selector
            cy.get('#' + sectionSelector.el.dom.id).click();

            // click ELA Studio element of picker dropdown
            cy.get('#' + sectionSelector.getPicker().id + ' .x-boundlist-item')
                .contains('ELA Studio')
                .click();

            // verify hash
            cy.location('hash').should('eq', '#ELA-001/all');

            // verify content loads
            var studentGrid = extQuerySelector('slate-studentsgrid');
            cy.get('#' + studentGrid.el.dom.id).contains('ELA Task One');
        });
    });
});