describe('CBL: Teacher demonstrations test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
    });

    it('View single demonstration rubric as teacher', () => {
        // set up XHR monitors
        cy.intercept('GET', '/cbl/dashboards/demonstrations/teacher/bootstrap').as('getBootstrapData');
        cy.intercept('GET', '/cbl/content-areas?summary=true').as('getCompetencyAreas');
        cy.intercept('GET', '/people/*student-lists').as('getMyStudentLists');
        cy.intercept('GET', '/people/*student-lists?sections=all').as('getAllStudentLists');
        cy.intercept('GET', '/cbl/student-competencies?*').as('getStudentCompetencies');


        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/demonstrations/teacher');

        // ensure bootstrap data is loaded
        cy.wait('@getBootstrapData');
        cy.get('@getBootstrapData.all').should('have.length', 1);

        // verify teacher redirect
        cy.location('hash').should('eq', '#_');
        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder ')
            .contains('Select a list of students and a content area to load progress dashboard');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the 'Rubric' selector element
            var rubricSelector = extQuerySelector('slate-cbl-contentareaselector');

            // click the selector
            cy.get('#' + rubricSelector.el.dom.id).click();

            // ensure competency areas are loaded
            cy.wait('@getCompetencyAreas');
            cy.get('@getCompetencyAreas.all').should('have.length', 1);

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
                .type('Exa');

            // ensure student lists are loaded
            cy.wait('@getMyStudentLists');
            cy.get('@getMyStudentLists.all').should('have.length', 1);

            // verify and click first element of picker dropdown
            cy.get('#' + studentSelector.getPicker().id)
                .contains('Example School')
                .click();

            // ensure student competencies are loaded
            cy.wait('@getStudentCompetencies');
            cy.get('@getStudentCompetencies.all').should('have.length', 1);

            // verify hash updates
            cy.location('hash').should('eq', '#ELA/group:example_school');

            // verify content loads
            cy.get('.cbl-grid-competencies').contains('Reading Critically');

            // click the selector
            cy.get('#' + studentSelector.el.dom.id)
                .click()
                .focused()
                .type('{selectall}{backspace}{downarrow}');

            // expand list to all sections
            cy.get('#' + studentSelector.getPicker().id)
                .contains('Show all sections')
                .scrollIntoView()
                .closest('button')
                .click('center', { force: true })  //scrollIntoView does not appear to be working

            // ensure student lists are loaded
            cy.wait('@getAllStudentLists');
            cy.get('@getAllStudentLists.all').should('have.length', 1);

            // verify and click empty section element of picker dropdown
            cy.get('#' + studentSelector.getPicker().id)
                .contains('Jarvus Innovations')
                .scrollIntoView()
                .click({force: true}); //scrollIntoView does not appear to be working

            // ensure student competencies are loaded
            cy.wait('@getStudentCompetencies');
            cy.get('@getStudentCompetencies.all').should('have.length', 2);

            // verify hash updates
            cy.location('hash').should('eq', '#ELA/group:jarvus');

            // verify content loads
            cy.get('.cbl-grid-main').should('be.empty');
        });
    });
});