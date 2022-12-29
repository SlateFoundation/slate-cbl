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

    function loadDashboard(hashPath) {
        // open student demonstrations dashboard
        cy.visit(`/cbl/dashboards/demonstrations/teacher${hashPath ? `#${hashPath}` : ''}`);

        // ensure bootstrap data is loaded
        cy.wait('@getBootstrapData');
        cy.get('@getBootstrapData.all').should('have.length', 1);

        // verify teacher redirect
        cy.location('hash').should('eq', hashPath ? `#${hashPath}` : '#_');

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
                    .click({ force: true });

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
                    .click({ force: true });

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
            .click({ force: true });

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

    it('Load progress grid via selectors', () => {

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

    function withHealthAndWellnessSkillRows({ competencyId, competencyStatement, skillsCount, assertions }) {
        loadDashboard('HW/group:class_of_2020');

        // ensure student competencies are loaded
        cy.wait('@getStudentCompetencies');
        cy.get('@getStudentCompetencies.all').should('have.length', 1);

        // verify hash updates
        cy.location('hash').should('eq', '#HW/group:class_of_2020');

        // verify content loads
        cy.extGet('slate-demonstrations-teacher-dashboard')
            .find('.cbl-grid-competency-name')
            .should('have.length', 3);

        cy.extGet('slate-demonstrations-teacher-dashboard')
            .find('.cbl-grid-student-name')
            .should('have.length', 3)
            .first()
                .should('have.text', 'Student Slate');

        // expand competency
        cy.get(`.cbl-grid-progress-row[data-competency="${competencyId}"] .cbl-grid-competency-name`)
            .should('have.text', competencyStatement)
            .click();

        // apply assertion to skill rows
        cy.get(`.cbl-grid-main .cbl-grid-skills-row[data-competency="${competencyId}"]`)
            .should('have.length', 1)
            .should('have.class', 'is-expanded')
            .find('.cbl-grid-skill-row')
                .should('have.length', skillsCount)
                .should(assertions);
    }

    it('Verify HW.1 rendering', () => {
        withHealthAndWellnessSkillRows({
            competencyId: 12,
            competencyStatement: 'Apply Knowledge of Health Concepts',
            skillsCount: 4,
            assertions: ($skillRows) => {
                var $skillCells, $demoItems;

                // HW.1.1
                expect($skillRows[0]).to.have.attr('data-skill', '48');
                $skillCells = $skillRows.eq(0).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.1.1 - student
                expect($skillCells[0]).to.have.class('cbl-level-10');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);

                // HW.1.1 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(2);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('7');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-counted').and.have.text('8');

                // HW.1.1 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(3);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('8');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');
                expect($demoItems[2]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.1.2
                expect($skillRows[1]).to.have.attr('data-skill', '49');
                $skillCells = $skillRows.eq(1).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.1.2 - student
                expect($skillCells[0]).to.have.class('cbl-level-10');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);

                // HW.1.2 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(2);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('7');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-counted').and.have.class('cbl-skill-demo-override').and.have.descendants('.fa-check');

                // HW.1.2 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(3);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('8');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');
                expect($demoItems[2]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.1.3
                expect($skillRows[2]).to.have.attr('data-skill', '50');
                $skillCells = $skillRows.eq(2).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.1.2 - student
                expect($skillCells[0]).to.have.class('cbl-level-10');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);

                // HW.1.2 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(2);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('7');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-counted').and.have.class('cbl-skill-demo-override').and.have.descendants('.fa-check');

                // HW.1.2 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(3);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('8');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');
                expect($demoItems[2]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.1.4
                expect($skillRows[3]).to.have.attr('data-skill', '51');
                $skillCells = $skillRows.eq(3).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.1.2 - student
                expect($skillCells[0]).to.have.class('cbl-level-10');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);

                // HW.1.2 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(2);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('7');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.1.2 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);
            }
        });
    });

    it('Verify HW.2 rendering', () => {
        withHealthAndWellnessSkillRows({
            competencyId: 13,
            competencyStatement: 'Analyze Health Promotion and Risk Reduction',
            skillsCount: 5,
            assertions: ($skillRows) => {
                var $skillCells, $demoItems;

                // HW.2.1
                expect($skillRows[0]).to.have.attr('data-skill', '52');
                $skillCells = $skillRows.eq(0).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.2.1 - student
                expect($skillCells[0]).to.have.class('cbl-level-10');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);

                // HW.2.1 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(1);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.class('cbl-skill-demo-override').and.have.descendants('.fa-check');

                // HW.2.1 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(3);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('8');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-counted').and.have.text('9');
                expect($demoItems[2]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.2.2
                expect($skillRows[1]).to.have.attr('data-skill', '53');
                $skillCells = $skillRows.eq(1).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.2.2 - student
                expect($skillCells[0]).to.have.class('cbl-level-10');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);

                // HW.2.2 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(1);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.class('cbl-skill-demo-override').and.have.descendants('.fa-check');

                // HW.2.2 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(3);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('8');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-counted').and.have.text('9');
                expect($demoItems[2]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.2.3
                expect($skillRows[2]).to.have.attr('data-skill', '54');
                $skillCells = $skillRows.eq(2).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.2.3 - student
                expect($skillCells[0]).to.have.class('cbl-level-10');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);

                // HW.2.3 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(2);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-missed').and.have.text('M');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.2.3 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(3);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('8');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');
                expect($demoItems[2]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.2.4
                expect($skillRows[3]).to.have.attr('data-skill', '55');
                $skillCells = $skillRows.eq(3).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.2.4 - student
                expect($skillCells[0]).to.have.class('cbl-level-10');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);

                // HW.2.4 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(2);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-missed').and.have.text('M');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.2.4 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(3);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');
                expect($demoItems[2]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.2.5
                expect($skillRows[4]).to.have.attr('data-skill', '56');
                $skillCells = $skillRows.eq(4).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.2.5 - student
                expect($skillCells[0]).to.have.class('cbl-level-10');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);

                // HW.2.5 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(2);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-missed').and.have.text('M');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.2.5 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);
            }
        });
    });

    it('Verify HW.3 rendering', () => {
        withHealthAndWellnessSkillRows({
            competencyId: 14,
            competencyStatement: 'Engage in Health Advocacy',
            skillsCount: 4,
            assertions: ($skillRows) => {
                var $skillCells, $demoItems;

                // HW.3.1
                expect($skillRows[0]).to.have.attr('data-skill', '57');
                $skillCells = $skillRows.eq(0).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.3.1 - student
                expect($skillCells[0]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(1);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.class('cbl-skill-demo-override').and.have.descendants('.fa-check');

                // HW.3.1 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(1);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.class('cbl-skill-demo-override').and.have.descendants('.fa-check');

                // HW.3.1 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(3);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('8');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-counted').and.have.text('9');
                expect($demoItems[2]).to.have.class('cbl-skill-demo-counted').and.have.text('11');

                // HW.3.2
                expect($skillRows[1]).to.have.attr('data-skill', '58');
                $skillCells = $skillRows.eq(1).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.3.2 - student
                expect($skillCells[0]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(1);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.class('cbl-skill-demo-override').and.have.descendants('.fa-check');

                // HW.3.2 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(1);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.class('cbl-skill-demo-override').and.have.descendants('.fa-check');

                // HW.3.2 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(3);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('8');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-counted').and.have.text('10');
                expect($demoItems[2]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.3.3
                expect($skillRows[2]).to.have.attr('data-skill', '59');
                $skillCells = $skillRows.eq(2).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.3.3 - student
                expect($skillCells[0]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(2);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('7');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.3.3 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(1);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.class('cbl-skill-demo-override').and.have.descendants('.fa-check');

                // HW.3.3 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(3);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');
                expect($demoItems[2]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.3.4
                expect($skillRows[3]).to.have.attr('data-skill', '60');
                $skillCells = $skillRows.eq(3).find('.cbl-grid-demos-cell');
                expect($skillCells).to.have.length(3);

                // HW.3.4 - student
                expect($skillCells[0]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(0).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(2);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-counted').and.have.text('7');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.3.4 - student 2
                expect($skillCells[1]).to.have.class('cbl-level-9');
                $demoItems = $skillCells.eq(1).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(2);
                expect($demoItems[0]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');
                expect($demoItems[1]).to.have.class('cbl-skill-demo-uncounted').and.have.html('&nbsp;');

                // HW.3.4 - student 3
                expect($skillCells[2]).to.have.class('cbl-level-11');
                $demoItems = $skillCells.eq(2).find('.cbl-skill-demo');
                expect($demoItems).to.have.length(0);
            }
        });
    });
});
