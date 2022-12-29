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
        cy.intercept('GET', '/people/*student-lists?(\\?sections=enrolled)').as('getMyStudentLists');
        cy.intercept('GET', '/people/*student-lists\\?sections=all').as('getAllStudentLists');
        cy.intercept('GET', '/cbl/student-competencies?(\\?*)').as('getStudentCompetencies');

        cy.loginAs('teacher');
    });

    function loadDashboard() {
        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/demonstrations/teacher');

        // ensure bootstrap data is loaded
        cy.wait('@getBootstrapData');
        cy.get('@getBootstrapData.all').should('have.length', 1);

        // verify teacher redirect
        cy.location('hash').should('eq', '#_');

        // verify placeholder
        cy.extGet('slate-demonstrations-teacher-dashboard')
            .contains('.slate-placeholder', 'Select a list of students and a content area to load progress dashboard');
    }

    it('Archived competency areas are hidden', () => {

        loadDashboard();

        // click the 'Rubric' selector
        cy.extGet('slate-cbl-contentareaselector')
            .should('exist')
            .click();

        // ensure competency areas are loaded
        cy.wait('@getCompetencyAreas');
        cy.get('@getCompetencyAreas.all').should('have.length', 1);

        // verify archived option is not shown and regular option is
        cy.extGet('slate-cbl-contentareaselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .should('not.contain', 'Archived Area')
            .should('contain', 'English Language Arts');
    });

    it('Toggle between my and all sections', () => {

        loadDashboard();

        // click the 'Students' selector
        cy.extGet('slate-cbl-studentslistselector')
            .should('exist')
            .find('.x-form-arrow-trigger')
            .click();

        // ensure student lists are loaded
        cy.wait('@getMyStudentLists');
        cy.get('@getMyStudentLists.all').should('have.length', 1);

        // verify picker state and behavior
        cy.extGet('slate-cbl-studentslistselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .within(($picker) => {
                function verifyMySectionsRendered() {
                    cy.get('.x-boundlist-item')
                    .should('have.length', 19)
                    .should(($items) => {
                        expect($items[0]).to.contain.text('MATH-001');
                        expect($items[1]).to.contain.text('ELA-001').and.not.contain.text('Group');
                        expect($items[2]).to.contain.text('ELA-001').and.contain.text('Group A');
                        expect($items[3]).to.contain.text('ELA-001').and.contain.text('Group B');
                        expect($items[4]).to.contain.text('Example School');
                    });

                    cy.get('.group-header')
                        .should('have.length', 2)
                        .should(($groupHeaders) => {
                            expect($groupHeaders[0]).to.contain.text('My Sections');
                            expect($groupHeaders[1]).to.contain.text('User Groups');
                        });
                }

                // verify initial picker state
                verifyMySectionsRendered();

                // toggle to all sections
                cy.get('.group-header button')
                    .should('have.length', 1)
                    .scrollIntoView()
                    .should('contain.text', 'Show all sections')
                    .click();

                // ensure expanded student lists are loaded
                cy.wait('@getAllStudentLists');
                cy.get('@getAllStudentLists.all').should('have.length', 1);

                // verify new picker state
                cy.get('.x-boundlist-item')
                    .should('have.length', 20)
                    .should(($items) => {
                        expect($items[0]).to.contain.text('MATH-001');
                        expect($items[1]).to.contain.text('ELA-001').and.not.contain.text('Group');
                        expect($items[2]).to.contain.text('ELA-001').and.contain.text('Group A');
                        expect($items[3]).to.contain.text('ELA-001').and.contain.text('Group B');
                        expect($items[4]).to.contain.text('ELA-EMPTY');
                        expect($items[5]).to.contain.text('Example School');
                    });

                cy.get('.group-header')
                    .should('have.length', 2)
                    .should(($groupHeaders) => {
                        expect($groupHeaders[0]).to.contain.text('All sections in');
                        expect($groupHeaders[1]).to.contain.text('User Groups');
                    });

                // toggle back to sections
                cy.get('.group-header button')
                    .should('have.length', 1)
                    .scrollIntoView()
                    .should('contain.text', 'Show only my sections')
                    .click();

                // ensure student lists are loaded
                cy.wait('@getMyStudentLists');
                cy.get('@getMyStudentLists.all').should('have.length', 2);

                // verify returned to my sections state
                verifyMySectionsRendered();

                cy.get('.group-header button')
                    .should('have.length', 1)
                    .should('contain.text', 'Show all sections')
            });
    });

    it('Selection with no matching enrollments is empty', () => {

        loadDashboard();

        // click the 'Rubric' selector
        cy.extGet('slate-cbl-contentareaselector')
            .should('exist')
            .click();

        // ensure competency areas are loaded
        cy.wait('@getCompetencyAreas');
        cy.get('@getCompetencyAreas.all').should('have.length', 1);

        // click ELA item
        cy.extGet('slate-cbl-contentareaselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .contains('.x-boundlist-item', 'English Language Arts')
            .click();

        // verify hash updates
        cy.location('hash').should('eq', '#ELA');

        // click the 'Students' selector
        cy.extGet('slate-cbl-studentslistselector')
            .should('exist')
            .find('.x-form-arrow-trigger')
            .click()

        // ensure student lists are loaded
        cy.wait('@getMyStudentLists');
        cy.get('@getMyStudentLists.all').should('have.length', 1);

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
            .contains('.x-boundlist-item', 'ELA-EMPTY')
            .scrollIntoView()
            .click();

        // ensure student competencies are loaded
        cy.wait('@getStudentCompetencies');
        cy.get('@getStudentCompetencies.all').should('have.length', 1);

        // verify hash updates
        cy.location('hash').should('eq', '#ELA/section:ELA-EMPTY');

        // verify content loads
        cy.extGet('slate-demonstrations-teacher-dashboard')
            .find('.cbl-grid-main')
            .should('be.empty');
    });

    it('Load progress grid', () => {

        loadDashboard();

        // click the 'Rubric' selector
        cy.extGet('slate-cbl-contentareaselector')
            .click();

        // ensure competency areas are loaded
        cy.wait('@getCompetencyAreas');
        cy.get('@getCompetencyAreas.all').should('have.length', 1);

        // click ELA item
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
            .type('2020', { delay: 1 });

        // ensure student lists are loaded
        cy.wait('@getMyStudentLists');
        cy.get('@getMyStudentLists.all').should('have.length', 1);

        // verify and click first element of picker dropdown
        cy.extGet('slate-cbl-studentslistselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .find('.x-boundlist-item')
            .should('have.length', 1)
            .first()
                .should('contain.text', 'Class of 2020')
                .click();

        // ensure student competencies are loaded
        cy.wait('@getStudentCompetencies');
        cy.get('@getStudentCompetencies.all').should('have.length', 1);

        // verify hash updates
        cy.location('hash').should('eq', '#ELA/group:class_of_2020');

        // verify content loads
        cy.extGet('slate-demonstrations-teacher-dashboard')
            .find('.cbl-grid-competency-name')
            .should('have.length', 7)
            .first()
                .should('have.text', 'Reading Critically');

        cy.extGet('slate-demonstrations-teacher-dashboard')
            .find('.cbl-grid-student-name')
            .should('have.length', 5)
            .first()
                .should('have.text', 'Student Slate');
    });
});