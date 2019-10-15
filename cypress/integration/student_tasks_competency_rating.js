describe('Student tasks demonstrations competency rating level test', () => {

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
        cy.visit('/cbl/dashboards/tasks/teacher#ELA-001/all');

        // wait for grid container to load
        cy.get('.slate-appcontainer').contains('ELA Task One');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // find teh student's grid
            var studentsGrid = extQuerySelector('slate-studentsgrid');

            // find and click the first grid cell
            cy.get('#' + studentsGrid.el.dom.id + ' .slate-studentsgrid-cell')
                .first()
                .click();

            // ensure the first skill rating field has class 'cbl-level-9'
            cy.get('.slate-cbl-skillratingsfield .slate-cbl-ratings-slider')
                .first()
                .should('have.have.class', 'cbl-level-9')
        });
    });
});