describe('CBL: Teacher student competencies test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
        cy.intercept('GET', '/cbl/content-areas?(\\?*)').as('getContentAreas');
        cy.intercept('GET', '/people/\\*student-lists').as('getStudentLists');
    });

    it('View student competencies dashboard as teacher', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/student-competencies/admin');

        // verify teacher redirect
        cy.location('hash').should('eq', '');
        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
            .contains('Select a list of students and a content area to load enrollments dashboard');

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

        // verify hash updates
        cy.location('hash').should('eq', '#ELA');

        // click the 'Students' selector
        cy.extGet('slate-cbl-studentslistselector')
            .should('exist')
            .click()
            .focused()
            .type('EXA');

        // wait for options to load
        cy.wait('@getStudentLists');

        // verify and click first element of picker dropdown
        cy.extGet('slate-cbl-studentslistselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .contains('.x-boundlist-item', 'Example School')
            .click();

        // verify hash updates
        cy.location('hash').should('eq', '#ELA/group:example_school');

        // verify content loads
        cy.get('.slate-studentcompetencies-admin-grid')
            .contains('Student Slate');
    });
});