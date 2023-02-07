const { getSlidersRatingSelector } = require('../../../support/ratings.js')

describe('CBL / Progress / Overrides', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        // set up XHR monitors
        cy.intercept('GET', '/cbl/dashboards/demonstrations/teacher/bootstrap').as('getBootstrapData');
        cy.intercept('/cbl/student-competencies?(\\?*)').as('getStudentCompetencies');
        cy.intercept('/cbl/demonstration-skills?(\\?*)').as('getDemonstrationSkills');
        cy.intercept('POST', '/cbl/demonstrations/save?(\\?*)').as('saveDemonstration');

        cy.loginAs('teacher');
    });

    it('Override all skills in a competency with one ER and no other ratings to trigger graduation', () => {
        loadDashboard('SS', 'group:class_of_2020');

        const competency = 30; // SS.2
        const skill = 166; // SS.2.4
        const student = 6; // student2

        overrideSkill(competency, skill, student);

        // check portfolio value for graduation at cell at SS.2 - student2
        cy.get(`.cbl-grid-main .cbl-grid-progress-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .find(`.cbl-grid-progress-cell[data-student="${student}"]`)
                .should('have.length', 1)
                .should('have.class', 'cbl-level-10')
                .find('.cbl-grid-progress-percent')
                    .should('contain.text', '0%')
    });

    it('Override all skills in a competency with multiple ER and no other ratings to trigger graduation', () => {
        loadDashboard('SS', 'group:class_of_2020');

        const competency = 29; // SS.1
        const skill = 162; // SS.1.5
        const student = 6; // student2

        overrideSkill(competency, skill, student);

        // check portfolio value for graduation at cell at SS.1 - student2
        cy.get(`.cbl-grid-main .cbl-grid-progress-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .find(`.cbl-grid-progress-cell[data-student="${student}"]`)
                .should('have.length', 1)
                .should('have.class', 'cbl-level-10')
                .find('.cbl-grid-progress-percent')
                    .should('contain.text', '0%')
    });

    it('Override one skill in a competency with one ER and one rating should have no impact', () => {
        loadDashboard('SS', 'group:class_of_2020');

        const competency = 30; // SS.2
        const skill = 165; // SS.2.3
        const student = 4; // student

        // check values for progress and performance level for SS.2 - student
        cy.get(`.cbl-grid-main .cbl-grid-progress-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .find(`.cbl-grid-progress-cell[data-student="${student}"]`)
                .should('have.length', 1)
                .should('have.class', 'cbl-level-9')
                .within(() => {
                    cy.get('.cbl-level-progress-percent').should('contain.text', '75%')
                    cy.get('.cbl-level-progress-average').should('contain.text', '6')
                });

        overrideSkill(competency, skill, student);

        // ensure values for progress and performance remain the same
        cy.get(`.cbl-grid-main .cbl-grid-progress-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .find(`.cbl-grid-progress-cell[data-student="${student}"]`)
                .should('have.length', 1)
                .should('have.class', 'cbl-level-9')
                .within(() => {
                    cy.get('.cbl-level-progress-percent').should('contain.text', '75%')
                    cy.get('.cbl-level-progress-average').should('contain.text', '6')
                });
    });

    it('Override skill with multiple ERs and one rating.', () => {
        loadDashboard('SS', 'group:class_of_2020');

        const competency = 29; // SS.1
        const skill = 160; // SS.1.3
        const student = 4; //student

        // check values for progress and performance level for SS.2 - student
        cy.get(`.cbl-grid-main .cbl-grid-progress-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .find(`.cbl-grid-progress-cell[data-student="${student}"]`)
                .should('have.length', 1)
                .should('have.class', 'cbl-level-9')
                .within(() => {
                    cy.get('.cbl-level-progress-percent').should('contain.text', '53%')
                    cy.get('.cbl-level-progress-average').should('contain.text', '6.5')
                });

        overrideSkill(competency, skill, student);

        // ensure values for progress and performance have update appropriately
        cy.get(`.cbl-grid-main .cbl-grid-progress-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .find(`.cbl-grid-progress-cell[data-student="${student}"]`)
                .should('have.length', 1)
                .should('have.class', 'cbl-level-9')
                .within(() => {
                    cy.get('.cbl-level-progress-percent').should('contain.text', '67%')
                    cy.get('.cbl-level-progress-average').should('contain.text', '6.5')
                });
    });

    it('Submit override resulting in graduation.', () => {
        loadDashboard('SS', 'group:class_of_2020');

        const competency = 31; // SS.3
        const skill = 168;    // SS.3.2
        const student = 4; // student

        overrideSkill(competency, skill, student);

        // ensure values for progress and performance have update appropriately
        cy.get(`.cbl-grid-main .cbl-grid-progress-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .find(`.cbl-grid-progress-cell[data-student="${student}"]`)
                .should('have.length', 1)
                .should('have.class', 'cbl-level-10')
                .find('.cbl-grid-progress-percent')
                    .should('contain.text', '0%')
    });

    it('Override a skill with an M rating and one white box.', () => {
        loadDashboard('SS', 'group:class_of_2020');

        const competency = 32; // SS.4
        const skill = 169; // SS.4.1
        const student = 4; // student

        overrideSkill(competency, skill, student);

        // check portfolio value for graduation at cell at SS.4 - student
        cy.get(`.cbl-grid-main .cbl-grid-progress-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .find(`.cbl-grid-progress-cell[data-student="${student}"]`)
                .should('have.length', 1)
                .should('have.class', 'cbl-level-10')
                .find('.cbl-grid-progress-percent')
                    .should('contain.text', '0%')
    });

    it('Override for all skills where one set of ERs has all Ms.', () => {
        loadDashboard('SS', 'group:class_of_2020');

        const competency = 32; // SS.4
        const skill = 170; // SS.4.2
        const student = 6; // student2

        overrideSkill(competency, skill, student);

        // check portfolio value for graduation at cell at SS.4 - student
        cy.get(`.cbl-grid-main .cbl-grid-progress-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .find(`.cbl-grid-progress-cell[data-student="${student}"]`)
                .should('have.length', 1)
                .should('have.class', 'cbl-level-10')
                .find('.cbl-grid-progress-percent')
                    .should('contain.text', '0%')
    });

    it('Submit a rating for a skill with an override.', () => {
        loadDashboard('ELA', 'group:class_of_2020');

        const competency = 6; // ELA.6
        const skill = 28; // ELA.6.1
        const student = 6; // student2

        // expand competency
        cy.get(`.cbl-grid-progress-row[data-competency="${competency}"] .cbl-grid-competency-name`)
            .should('have.length', 1)
            .click();

        // click cell for given skill/student
        cy.get(`.cbl-grid-main .cbl-grid-skills-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .should('have.class', 'is-expanded')
            .find(`.cbl-grid-skill-row[data-skill="${skill}"] .cbl-grid-demos-cell[data-student="${student}"]`)
                .click();

        // wait for window to transition open
        cy.extGet('title[text="Skill History"] ^ slate-window')
            .should('not.have.class', 'x-hidden-clip')
            .within(($window) => {
                cy.extGet('button[text="Submit Evidence"]')
                    .should('exist')
                    .click();
            });

        // wait for window to transition open
        cy.extGet('title[text="Submit Evidence"] ^ slate-window')
            .should('not.have.class', 'x-hidden-clip')
            .within(($window) => {
                cy.extGet('slate-cbl-demonstrations-demonstrationform combobox[fieldLabel="Type of Experience"]')
                    .type('Studio');

                cy.extGet('slate-cbl-demonstrations-demonstrationform combobox[fieldLabel="Name of Experience"]')
                    .type('Test');

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
        cy.extGet('title[text="Skill History"] ^ slate-window')
            .should('not.have.class', 'x-hidden-clip')
            .within(($window) => {
                cy.extGet('tool[type="close"]')
                    .should('exist')
                    .click();
            });

        // check portfolio value for correct values for ELA.6.1 - student2
        cy.get(`.cbl-grid-main .cbl-grid-progress-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .find(`.cbl-grid-progress-cell[data-student="${student}"]`)
                .should('have.length', 1)
                .should('have.class', 'cbl-level-10')
                .within(() => {
                    cy.get('.cbl-level-progress-percent').should('contain.text', '56%')
                    cy.get('.cbl-level-progress-average').should('contain.text', '8.5')
                });

        // check skill boxes for correct values for ELA.6.1 - student2
        cy.get(`.cbl-grid-main .cbl-grid-skills-row[data-competency="${competency}"]`)
            .should('have.length', 1)
            .find(`.cbl-grid-skill-row[data-skill="${skill}"]`)
                .should('have.length', 1)
                .find(`.cbl-grid-demos-cell[data-student="${student}"]`)
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
});

function loadDashboard(competencyArea, studentsList) {
    // open student demonstrations dashboard
    cy.visit(`/cbl/dashboards/demonstrations/teacher#${competencyArea}/${studentsList}`);

    // ensure bootstrap data is loaded
    cy.wait('@getBootstrapData');
    cy.get('@getBootstrapData.all').should('have.length', 1);

    // verify teacher redirect
    cy.location('hash').should('eq', `#${competencyArea}/${studentsList}`);

    // ensure student competencies are loaded
    cy.wait('@getStudentCompetencies');
    cy.get('@getStudentCompetencies.all').should('have.length', 1);

    // verify placeholder is gone
    cy.extGet('slate-demonstrations-teacher-dashboard')
        .find('.slate-placeholder')
            .should('not.be.visible');

    // verify competencies loaded
    cy.extGet('slate-demonstrations-teacher-dashboard')
        .find('.cbl-grid-competency-name')
            .should('have.length.greaterThan', 0);
};

function overrideSkill(competency, skill, student) {
    // expand competency
    cy.get(`.cbl-grid-progress-row[data-competency="${competency}"] .cbl-grid-competency-name`)
        .should('have.length', 1)
        .click();

    // click cell for given skill/student
    cy.get(`.cbl-grid-main .cbl-grid-skills-row[data-competency="${competency}"]`)
        .should('have.length', 1)
        .should('have.class', 'is-expanded')
        .find(`.cbl-grid-skill-row[data-skill="${skill}"] .cbl-grid-demos-cell[data-student="${student}"]`)
            .click();

    // ensure bootstrap data is loaded
    cy.wait('@getDemonstrationSkills');
    cy.get('@getDemonstrationSkills.all').should('have.length', 1);

    // wait for history window to transition open
    cy.extGet('title[text="Skill History"] ^ slate-window')
        .should('not.have.class', 'x-hidden-clip')
        .within(() => {
            cy.get('.x-btn-inner:contains("Override")')
                .should('have.length', 1)
                .click();
        });

    // wait for override window to transition open
    cy.extGet('title[text="Override Standard"] ^ slate-window')
        .should('have.length', 1)
        .should('not.have.class', 'x-hidden-clip')
        .within(() => {
            cy.get('.x-btn-inner:contains("Submit Override")')
                .should('have.length', 1)
                .click();
        });

    cy.wait('@saveDemonstration');

    // close the history window
    cy.extGet('title[text="Skill History"] ^ slate-window')
        .should('have.length', 1)
        .should('not.have.class', 'x-hidden-clip')
        .within(() => {
            cy.get('.x-tool-close')
                .should('exist')
                .click();
        });

    cy.wait('@getDemonstrationSkills');
};
