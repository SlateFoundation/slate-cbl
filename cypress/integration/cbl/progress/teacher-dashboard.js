describe('CBL / Progress / Teacher Dashboard', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        // set up XHR monitors
        cy.intercept('GET', '/cbl/dashboards/demonstrations/teacher/bootstrap').as('getBootstrapData');
        cy.intercept('GET', '/cbl/content-areas\\?summary=true').as('getCompetencyAreas');
        cy.intercept('GET', '/people/*student-lists').as('getMyStudentLists');
        cy.intercept('GET', '/people/*student-list\\s?sections=all').as('getAllStudentLists');
        cy.intercept('GET', '/cbl/student-competencies?(\\?*)').as('getStudentCompetencies');

        cy.loginAs('teacher');
    });

    it('View single demonstration rubric as teacher', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/demonstrations/teacher');

        // ensure bootstrap data is loaded
        cy.wait('@getBootstrapData');
        cy.get('@getBootstrapData.all').should('have.length', 1);

        // verify teacher redirect
        cy.location('hash').should('eq', '#_');

        cy.extGet('slate-demonstrations-teacher-dashboard')
            .contains('.slate-placeholder', 'Select a list of students and a content area to load progress dashboard');

        // click the 'Rubric' selector
        cy.extGet('slate-cbl-contentareaselector')
            .click();

        // ensure competency areas are loaded
        cy.wait('@getCompetencyAreas');
        cy.get('@getCompetencyAreas.all').should('have.length', 1);

        // verify and click first element of picker dropdown
        cy.extGet('slate-cbl-contentareaselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .should('not.contain', 'Archived Area')
            .contains('.x-boundlist-item', 'English Language Arts')
            .click();

        // verify hash updates
        cy.location('hash').should('eq', '#ELA');

        // click the 'Students' selector
        cy.extGet('slate-cbl-studentslistselector')
            .should('exist')
            .click()
            .focused()
            .type('Exa');

        // ensure student lists are loaded
        cy.wait('@getMyStudentLists');
        cy.get('@getMyStudentLists.all').should('have.length', 1);

        // verify and click first element of picker dropdown
        cy.extGet('slate-cbl-studentslistselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .contains('.x-boundlist-item', 'Example School')
            .click();

        // ensure student competencies are loaded
        cy.wait('@getStudentCompetencies');
        cy.get('@getStudentCompetencies.all').should('have.length', 1);

        // verify hash updates
        cy.location('hash').should('eq', '#ELA/group:example_school');

        // verify content loads
        cy.extGet('slate-demonstrations-teacher-dashboard')
            .contains('.cbl-grid-competency-name', 'Reading Critically');

        // click the 'Students' selector
        cy.extGet('slate-cbl-studentslistselector')
            .click()
            .focused()
            .type('{selectall}{backspace}{downarrow}');

        // expand list to all sections
        cy.extGet('slate-cbl-studentslistselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .contains('button', 'Show all sections')
            .scrollIntoView()
            .click();

        // ensure student lists are loaded
        cy.wait('@getAllStudentLists');
        cy.get('@getAllStudentLists.all').should('have.length', 1);

        // verify and click empty section element of picker dropdown
        cy.extGet('slate-cbl-studentslistselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .contains('Jarvus Innovations')
            .scrollIntoView()
            .click();

        // ensure student competencies are loaded
        cy.wait('@getStudentCompetencies');
        cy.get('@getStudentCompetencies.all').should('have.length', 2);

        // verify hash updates
        cy.location('hash').should('eq', '#ELA/group:jarvus');

        // verify content loads
        cy.extGet('slate-demonstrations-teacher-dashboard')
            .find('.cbl-grid-main')
            .should('be.empty');
    });
});