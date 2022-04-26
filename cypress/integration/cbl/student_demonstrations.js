describe('CBL: Student demonstrations test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'student' user
    beforeEach(() => {
        cy.loginAs('student');
        cy.intercept('GET', '/cbl/content-areas?(\\?*)').as('getContentAreas');
    });

    it('View single demonstration rubric as student', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/demonstrations/student');

        // verify student redirect
        cy.location('hash').should('eq', '#me');
        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
            .contains('Select a content area to load demonstrations dashboard');

        // click the 'Rubric' selector
        cy.extGet('slate-cbl-contentareaselector')
            .click();

        // wait for options to load
        cy.wait('@getContentAreas');

        // verify and click first element of picker dropdown
        cy.extGet('slate-cbl-contentareaselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .contains('.x-boundlist-item', 'English Language Arts')
            .click();

        // verify content loads
        cy.get('.slate-demonstrations-student-competenciessummary span')
            .contains('English Language Arts');
    });
});