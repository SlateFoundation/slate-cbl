describe('CBL / Progress / Overrides', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        // set up XHR monitors
        cy.intercept('GET', '/cbl/dashboards/demonstrations/teacher/bootstrap').as('getBootstrapData');
        cy.intercept('GET', '/cbl/content-areas?(\\?*)').as('getContentAreas');     // todo: needed?
        cy.intercept('/cbl/student-competencies?(\\?*)').as('getStudentCompetencies');
        cy.intercept('/cbl/demonstration-skills?(\\?*)').as('getDemonstrationSkills');
        cy.intercept('POST', '/cbl/demonstrations/save?(\\?*)').as('saveDemonstration');

        cy.loginAs('teacher');
    });

    it.skip('Override all skills in a competency with one ER and no other ratings to trigger graduation', () => {
        loadTeacherDashboard('SS/group:class_of_2020');

        let competency = 30; // SS.2
        let skill = 166; // SS.2.4
        let student = 6; // student2

        overrideSkill(competency, skill, student);

        // check portfolio value for graduation at cell at SS.2 - student2
        cy.get('.cbl-grid-main .cbl-grid-progress-row[data-competency="30"]')
            .should('have.length', 1)
            .find('.cbl-grid-progress-cell[data-student="6"]')
                .should('have.length', 1)
                .should('have.class', 'cbl-level-10')
                .find('.cbl-grid-progress-percent')
                    .should('contain.text', '0%')
    });

    it.skip('Override all skills in a competency with multiple ER and no other ratings to trigger graduation', () => {
        loadTeacherDashboard('SS/group:class_of_2020');

        let competency = 29; // SS.1
        let skill = 162; // SS.1.5
        let student = 6; // student2

        overrideSkill(competency, skill, student);

        // check portfolio value for graduation at cell at SS.1 - student2
        cy.get('.cbl-grid-main .cbl-grid-progress-row[data-competency="29"]')
            .should('have.length', 1)
            .find('.cbl-grid-progress-cell[data-student="6"]')
                .should('have.length', 1)
                .should('have.class', 'cbl-level-10')
                .find('.cbl-grid-progress-percent')
                    .should('contain.text', '0%')
    });

    it.skip('Override one skill in a competency with one ER and one rating should have no impact', () => {
        loadTeacherDashboard('SS/group:class_of_2020');

        let competency = 30; // SS.2
        let skill = 165; // SS.2.3
        let student = 4; // student

        // check values for progress and performance level for SS.2 - student
        cy.get('.cbl-grid-main .cbl-grid-progress-row[data-competency="'+competency+'"]')
            .should('have.length', 1)
            .find('.cbl-grid-progress-cell[data-student="'+student+'"]')
                .should('have.length', 1)
                .should('have.class', 'cbl-level-9')
                .children()
                    .should('contain.text', '75%')
                    .and('contain.text', '6')

        overrideSkill(competency, skill, student);

        // ensure values for progress and performance remain the same
        cy.get('.cbl-grid-main .cbl-grid-progress-row[data-competency="'+competency+'"]')
            .should('have.length', 1)
            .find('.cbl-grid-progress-cell[data-student="'+student+'"]')
                .should('have.length', 1)
                .should('have.class', 'cbl-level-9')
                .children()
                    .should('contain.text', '75%')
                    .and('contain.text', '6')
    });

    it.skip('Override skill with multiple ERs and one rating.', () => {
        loadTeacherDashboard('SS/group:class_of_2020');

        let competency = 29; // SS.1
        let skill = 160; // SS.1.3
        let student = 4; //student

        // check values for progress and performance level for SS.2 - student
        cy.get('.cbl-grid-main .cbl-grid-progress-row[data-competency="'+competency+'"]')
            .should('have.length', 1)
            .find('.cbl-grid-progress-cell[data-student="'+student+'"]')
                .should('have.length', 1)
                .should('have.class', 'cbl-level-9')
                .children()
                    .should('contain.text', '53%')
                    .and('contain.text', '6.5')

        overrideSkill(competency, skill, student);

        // ensure values for progress and performance have update appropriately
        cy.get('.cbl-grid-main .cbl-grid-progress-row[data-competency="'+competency+'"]')
            .should('have.length', 1)
            .find('.cbl-grid-progress-cell[data-student="'+student+'"]')
                .should('have.length', 1)
                .should('have.class', 'cbl-level-9')
                .children()
                    .should('contain.text', '67%')
                    .and('contain.text', '6.5')
    });

    it.skip('Submit override resulting in graduation.', () => {
        loadTeacherDashboard('SS/group:class_of_2020');

        let competency = 31; // SS.3
        let skill = 168;    // SS.3.2
        let student = 4; // student

        overrideSkill(competency, skill, student);

        // ensure values for progress and performance have update appropriately
        cy.get('.cbl-grid-main .cbl-grid-progress-row[data-competency="'+competency+'"]')
            .should('have.length', 1)
            .find('.cbl-grid-progress-cell[data-student="'+student+'"]')
                .should('have.length', 1)
                .should('have.class', 'cbl-level-10')
                .find('.cbl-grid-progress-percent')
                    .should('contain.text', '0%')
    });

    it.skip('Override a skill with an M rating and one white box.', () => {
        loadTeacherDashboard('SS/group:class_of_2020');

        let competency = 32; // SS.4
        let skill = 169; // SS.4.1
        let student = 4; // student

        overrideSkill(competency, skill, student);

        // check portfolio value for graduation at cell at SS.4 - student
        cy.get('.cbl-grid-main .cbl-grid-progress-row[data-competency="'+competency+'"]')
            .should('have.length', 1)
            .find('.cbl-grid-progress-cell[data-student="'+student+'"]')
                .should('have.length', 1)
                .should('have.class', 'cbl-level-10')
                .find('.cbl-grid-progress-percent')
                    .should('contain.text', '0%')
    });

    it.skip('Override for all skills where one set of ERs has all Ms.', () => {
        loadTeacherDashboard('SS/group:class_of_2020');

        let competency = 32; // SS.4
        let skill = 170; // SS.4.2
        let student = 6; // student2

        overrideSkill(competency, skill, student);

        // check portfolio value for graduation at cell at SS.4 - student
        cy.get('.cbl-grid-main .cbl-grid-progress-row[data-competency="'+competency+'"]')
            .should('have.length', 1)
            .find('.cbl-grid-progress-cell[data-student="'+student+'"]')
                .should('have.length', 1)
                .should('have.class', 'cbl-level-10')
                .find('.cbl-grid-progress-percent')
                    .should('contain.text', '0%')
    });

    it('Submit a rating for a skill with an override.', () => {
        loadTeacherDashboard('ELA/group:class_of_2020');

        let competency = 6; // ELA.6
        let skill = 28; // ELA.6.1
        let student = 6; // student2

        // expand competency
        cy.get('.cbl-grid-progress-row[data-competency="'+competency+'"] .cbl-grid-competency-name')
            .should('have.length', 1)
            .click();

        // click cell for given skill/student
        cy.get('.cbl-grid-main .cbl-grid-skills-row[data-competency="'+competency+'"]')
            .should('have.length', 1)
            .should('have.class', 'is-expanded')
            .find('.cbl-grid-skill-row[data-skill="'+skill+'"] .cbl-grid-demos-cell[data-student="'+student+'"]')
                .click();

        // wait for window to transition open
        cy.extGet('slate-window title[text="Skill History"]')
            .should('not.have.class', 'x-hidden-clip')
            .within(($window) => {
                cy.extGet('button[text="Submit Evidence"]')
                    .should('exist')
                    .click();
            });

        // wait for window to transition open
        cy.extGet('slate-window title[text="Submit Evidence"]')
            .should('not.have.class', 'x-hidden-clip')
            .within(($window) => {
                // TODO: select using combo rather than typing
                cy.extGet('slate-cbl-demonstrations-demonstrationform combobox[fieldLabel="Type of Experience"]')
                    .type('Studio');

                cy.extGet('slate-cbl-demonstrations-demonstrationform combobox[fieldLabel="Name of Experience"]')
                    .type('Test');

                // TODO: select using combo rather than typing
                cy.extGet('slate-cbl-demonstrations-demonstrationform combobox[fieldLabel="Performance Task"]')
                    .type('Debate');

                cy.extGet('slate-cbl-ratings-slider', { all: true, component: true })
                        .should('have.length', 3)
                        .then(sliders => {
                            const _selectRating = getSlidersRatingSelector(sliders);

                            _selectRating(sliders[0], 9);
                        });

                cy.extGet('slate-cbl-demonstrations-demonstrationform textarea[fieldLabel="Comments"]')
                    .type('Test rating');

                cy.extGet('button[text="Save Evidence"]')
                    .should('exist')
                    .click();
            });

        // close the window
        cy.extGet('slate-window title[text="Skill History"]')
            .should('not.have.class', 'x-hidden-clip')
            .within(($window) => {
                cy.extGet('tool[type="close"]')
                    .should('exist')
                    .click();
            });

        // check portfolio value for correct values for ELA.6.1 - student2
        cy.get('.cbl-grid-main .cbl-grid-skills-row[data-competency="'+competency+'"]')
            .should('have.length', 1)
            .find('.cbl-grid-skill-row[data-skill="'+skill+'"]')
                .should('have.length', 1)
                .find('.cbl-grid-demos-cell[data-student="'+student+'"]')
                    .should('have.length', 1)
                    .find('ul.cbl-skill-demos')
                        .children()
                            .should('have.length', 3)
                            .then(($children) => {
                                // The 9 should fill the second box and the override should only fill the third box.
                                cy.get($children[0]).should('contain.text', '10');
                                cy.get($children[1]).should('contain.text', '9');
                                cy.get($children[2]).should('have.class', 'cbl-skill-demo-override');
                            })

    });

    // TODO: taking this function from teacher-dashboard.js ... unify?
    function loadTeacherDashboard(hashPath) {
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
    };

    function overrideSkill(competency, skill, student) {
        // expand competency
        cy.get('.cbl-grid-progress-row[data-competency="'+competency+'"] .cbl-grid-competency-name')
            .should('have.length', 1)
            .click();

        // click cell for given skill/student
        cy.get('.cbl-grid-main .cbl-grid-skills-row[data-competency="'+competency+'"]')
            .should('have.length', 1)
            .should('have.class', 'is-expanded')
            .find('.cbl-grid-skill-row[data-skill="'+skill+'"] .cbl-grid-demos-cell[data-student="'+student+'"]')
                .click();

        // wait for window to transition open
        cy.extGet('slate-window title[text="Skill History"]')
            .should('not.have.class', 'x-hidden-clip')
            .within(($window) => {
                cy.extGet('button[text="Override"]')
                    .should('exist')
                    .click();
            });

        // wait for window to transition open
        cy.extGet('slate-window title[text="Override Standard"]')
            .should('not.have.class', 'x-hidden-clip')
            .within(($window) => {
                cy.extGet('slate-cbl-demonstrations-overrideform textarea[name="Comments"]')
                    .type('Test Override');

                cy.extGet('button[text="Submit Override"]')
                    .should('exist')
                    .click();
            });

        cy.wait('@saveDemonstration');

        // close the window
        cy.extGet('slate-window title[text="Skill History"]')
            .should('not.have.class', 'x-hidden-clip')
            .within(($window) => {
                cy.extGet('tool[type="close"]')
                    .should('exist')
                    .click();
            });

        cy.wait('@getDemonstrationSkills');
    };

    // TODO: taking this function from teacher-submit.js ... unify?
    function getSlidersRatingSelector(sliders) {
        const firstSlider = sliders[0];
        const { minRating, maxRating } = firstSlider.getConfig();
        const visibleRatings = Array.from({length: maxRating - minRating + 1 }, (_, i) => i + minRating)
        const totalThumbs = visibleRatings.length;
        const ratingWidth = firstSlider.innerEl.getWidth() / totalThumbs;

        return (slider, rating) => {
            const selectedRatingPos = visibleRatings.indexOf(rating);
            cy.wrap(slider.innerEl.dom)
                .click({
                    x: ratingWidth * (selectedRatingPos + 1),
                    y: 5,
                    force: true
                });
        };
    };
});