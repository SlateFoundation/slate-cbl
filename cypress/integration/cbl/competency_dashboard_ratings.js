describe('CBL: Competency dashboard ratings test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

     // authenticate as 'teacher' user
     beforeEach(() => {
        cy.loginAs('teacher');
        cy.intercept('GET', '/cbl/content-areas?*').as('getContentAreas');
        cy.intercept('GET', '/people/\\*student-lists').as('getStudentLists');
        cy.intercept('GET', '/cbl/student-competencies?*').as('studentCompetencyData');
        cy.intercept('GET', '/cbl/competencies?*').as('competencyData');
        cy.intercept('POST', '/cbl/demonstrations/save?*').as('saveDemonstration');
    });

    it('Can log a demonstration and verify the UI calculations', () => {
        cy.readFile('cypress/fixtures/cbl/levels.json').then((levels) => {

            // open student demonstrations dashboard
            cy.visit('/cbl/dashboards/demonstrations/teacher');

            // verify teacher redirect
            cy.location('hash').should('eq', '#_')
            cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
                .contains('Select a list of students and a content area to load progress dashboard')

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
            cy.location('hash').should('eq', '#ELA')

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

            // student competency data loads when student + rubric selectors set
            cy.wait('@studentCompetencyData')
                .then(({ response }) => {
                    const { ContentArea: { Competencies: competencies }} = response.body;

                    // verify Competencies have rendered on the page
                    cy.get('.cbl-grid-competencies')
                        .contains(competencies[0].Descriptor);

                    cy.get('.cbl-grid-competencies .cbl-grid-progress-row')
                        .should('have.length', competencies.length);
                });
            cy.get('@studentCompetencyData.all').should('have.length', 1);

            // click '+' button to submit evidence
            cy.get('a[role=button] span.fa-plus')
                .click()

            // competency data loads when opening evidence submission form
            cy.wait('@competencyData')
                .then(({ response }) => {
                    const { data: competencies, related: { ContentArea: contentAreas } } = response.body;

                    const [ firstCompetency, secondCompetency ] = competencies;

                    // competency grid in form should have 1 table for each content area
                    cy.extGet('slate-cbl-competenciesgrid')
                        .find('table')
                        .should('have.length', contentAreas.length);

                    // input values into demonstration form
                    cy.extGet('slate-cbl-demonstrations-demonstrationform')
                        .within(() => {
                            // enter a students name
                            cy.get('[name=StudentID]').type('Cross, Clarisa')

                            // enter an experience type
                            cy.get('[name=ExperienceType]').type('Studio', { force: true }) //input element may be hidden

                            cy.get('[name=Context]').type('Test', { force: true }) //input element may be hidden

                            // enter performance type
                            cy.get('[name=PerformanceType]').type('Debate', { force: true }) //input element may be hidden

                            // enter a url address
                            cy.get('[name=ArtifactURL]').type('https://google.com', { force: true }) //input element may be hidden
                        })

                    // search for first competency
                    cy.extGet('slate-cbl-demonstrations-demonstrationform', { component: true })
                        .then(form => form.getRatingsField())
                        .extGet('textfield')
                        .type(firstCompetency.Code);

                    // competency grid should only show the competency we typed
                    cy.extGet('slate-cbl-competenciesgrid')
                        .find('table')
                        .should('have.length', 1);

                    // select target competency in grid
                    cy.extGet('slate-cbl-competenciesgrid')
                        .contains('.x-grid-cell-inner .descriptor', firstCompetency.Descriptor)
                        .click();

                    cy.wait('@studentCompetencyData');
                    cy.get('@studentCompetencyData.all').should('have.length', 2);

                    // verify competency statement is shown and set ratings
                    cy.extGet(`slate-cbl-ratings-studentcompetency[title="${firstCompetency.Code}"]`, { component: true })
                        .should(competencySheet => {
                            expect(competencySheet)
                                .to.have.nested.property('el.dom')
                                .to.have.descendants('.competency-statement');

                            expect(Cypress.$(competencySheet.el.dom)
                                .find('.competency-statement'))
                                .to.have.text(firstCompetency.Statement);
                        })
                        .extGet('slate-cbl-ratings-slider', { all: true, component: true })
                        .should('have.length', firstCompetency.skillIds.length)
                        .then(sliders => {
                            const _selectRating = getSlidersRatingSelector(sliders);

                            // rate each skill with 12
                            for (const slider of sliders) {
                                _selectRating(slider, 12);
                            }
                        });

                    // return to competency adding tab
                    cy.extGet('tabpanel tab[text="Add competency"]')
                        .click();

                    // search for second competency
                    cy.extGet('slate-cbl-demonstrations-demonstrationform', { component: true })
                        .then(form => form.getRatingsField())
                        .extGet('textfield')
                        .type(secondCompetency.Code);

                    // competency grid should only show the competency we typed
                    cy.extGet('slate-cbl-competenciesgrid')
                        .find('table')
                        .should('have.length', 1);

                    // select target competency in grid
                    cy.extGet('slate-cbl-competenciesgrid')
                        .contains('.x-grid-cell-inner .descriptor', secondCompetency.Descriptor)
                        .click();

                    cy.wait('@studentCompetencyData');
                    cy.get('@studentCompetencyData.all').should('have.length', 3);

                    // verify competency statement is shown and set ratings
                    cy.extGet(`slate-cbl-ratings-studentcompetency[title="${secondCompetency.Code}"]`, { component: true })
                        .should(competencySheet => {
                            expect(competencySheet)
                                .to.have.nested.property('el.dom')
                                .to.have.descendants('.competency-statement');

                            expect(Cypress.$(competencySheet.el.dom).find('.competency-statement'))
                                .to.have.text(secondCompetency.Statement);
                        })
                        .extGet('slate-cbl-ratings-slider', { all: true, component: true })
                        .should('have.length', secondCompetency.skillIds.length)
                        .then(sliders => {
                            const _selectRating = getSlidersRatingSelector(sliders);

                            // rate each skill with 10
                            for (const slider of sliders) {
                                _selectRating(slider, 10);
                            }
                        });

                    // type comment into text area
                    cy.extGet('slate-cbl-demonstrations-demonstrationform textarea')
                        .type('test test test');

                    // submit the modal
                    cy.extGet('button[text="Save Evidence"]')
                        .click();

                    cy.wait('@saveDemonstration')
                        .then(({ response }) => {
                            // confirm completion %, avg, and level
                            const { data } = response.body;
                            const [ savedRecord ] = data;

                            // check the saved object
                            expect(savedRecord).to.have.property('StudentID')

                            const { StudentID: studentId } = savedRecord;

                            cy.get(`tr.cbl-grid-progress-row[data-competency="${firstCompetency.ID}"] td.cbl-grid-progress-cell[data-student=${studentId}]`)
                                .within(($el) => {
                                    cy.get($el.first()).click({ force: true })

                                    // NOTE: the followoing assertions can fail if the fixture data changes
                                    cy.contains('33%') // we input 1 rating for each skill (4/12 = 33%)
                                    cy.contains(levels['12'].abbreviation) // Level 4 Portfolio Progress
                                    cy.contains('12') // Avg of 12
                                });

                            cy.get(`tr.cbl-grid-progress-row[data-competency="${secondCompetency.ID}"] td.cbl-grid-progress-cell[data-student=${studentId}]`)
                                .within(($el) => {
                                    cy.get($el.first()).click({ force: true })

                                    // NOTE: the followoing assertions can fail if the fixture data changes
                                    cy.contains('33%') // we input 1 rating for each skill (4/12 = 33%)
                                    cy.contains(levels['12'].abbreviation) // Level 4 Portfolio Progress
                                    cy.contains('10') // Avg of 12
                                });

                            // NOTE: the following assertions can fail if the fixture data changes
                            // "12" rating on each skill in the first competency
                            cy.get(`tr.cbl-grid-skills-row[data-competency="${firstCompetency.ID}"] [data-student="${studentId}"] li[title="12"]`)
                                .should('have.length', firstCompetency.skillIds.length);

                            // "10" rating on each skill in the first competency
                            cy.get(`tr.cbl-grid-skills-row[data-competency="${secondCompetency.ID}"] [data-student="${studentId}"] li[title="10"]`)
                                .should('have.length', secondCompetency.skillIds.length);
                        });
                });
        });
    });
});

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
}