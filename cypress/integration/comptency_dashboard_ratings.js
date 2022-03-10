describe('Comptency dashboard ratings test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

     // authenticate as 'teacher' user
     beforeEach(() => {
        cy.loginAs('teacher');
        cy.server().route('GET', '/cbl/student-competencies*').as('studentCompetencyData');
        cy.server().route('GET', '/cbl/competencies*').as('competencyData');
        cy.server().route('POST', '/cbl/demonstrations/save*').as('saveDemonstration');
    });

    it('Can log a demonstration and verify the UI calculations', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/demonstrations/teacher');

        // verify teacher redirect
        cy.location('hash').should('eq', '#_')
        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
            .contains('Select a list of students and a content area to load progress dashboard')

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the 'Rubric' selector element
            const rubricSelector = extQuerySelector('slate-cbl-contentareaselector')

            // click the selector
            cy.get('#' + rubricSelector.el.dom.id).click();

            // verify and click first element of picker dropdown
            cy.get('#' + rubricSelector.getPicker().id + ' .x-boundlist-item')
            .contains('English Language Arts')
            .click()

            // verify hash updates
            cy.location('hash').should('eq', '#ELA')

            // get the 'Students' selector element
            const studentSelector = extQuerySelector('slate-cbl-studentslistselector')

            //click the selector
            cy.get('#' + studentSelector.el.dom.id)
                .click()
                .focused()
                .type('EXA')

            // verify and click first element of picker dropdown
            cy.get('#' + studentSelector.getPicker().id)
                .contains('Example School')
                .click()

            // verify hash updates
            cy.location('hash').should('eq', '#ELA/group:example_school');

            // student competency data loads when student + rubric selectors set
            cy.wait('@studentCompetencyData')
                .should(({ xhr }) => {
                    const { ContentArea: { Competencies: competencies }} = JSON.parse(xhr.response);

                    // verify Competencies have rendered on the page
                    cy.get('.cbl-grid-competencies').contains(competencies[0].Descriptor);
                    cy.get('.cbl-grid-competencies .cbl-grid-progress-row').should('have.length', competencies.length);
                });

            // click '+' button to submit evidence
            cy.get('a[role=button] span.fa-plus').click()

            // competency data loads when opening evidence submission form
            cy.wait('@competencyData')
                .should(({ xhr }) => {
                    const { data: competencies, related: { ContentArea: contentAreas } } = JSON.parse(xhr.response);

                    const firstCompetency = competencies[0];
                    const secondCompetency = competencies[1];
                    // const randomCompetency = competencies[competencies.length - Math.floor(Math.random() * (competencies.length - 2) + 2)];
                    const demonstrationForm = extQuerySelector('slate-cbl-demonstrations-demonstrationform')
                    const competencyGrid = extQuerySelector('slate-cbl-competenciesgrid')
                    const competencyCodeTextfield = demonstrationForm.getRatingsField().down('textfield')

                    // competency grid in form should have 1 table for each content area
                    cy.get('#' + competencyGrid.getId())
                        .find('table')
                        .should('have.length', contentAreas.length);

                    // input values into demonstration form
                    cy.get('#' + demonstrationForm.getId())
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

                    cy.get('#' + competencyCodeTextfield.getId()).type(firstCompetency.Code);

                    // comptency grid should only show the competency we typed
                    cy.get('#' + competencyGrid.getId())
                        .find('table')
                        .should('have.length', 1);

                    // compentency grid should only contain
                    cy.get('#' + competencyGrid.getId())
                        .contains(firstCompetency.Descriptor)
                        .click()

                    cy.wait('@studentCompetencyData')
                        .then(() => {
                            const studentCompetencyRatings = extQuerySelector('slate-cbl-ratings-studentcompetency');
                            let studentCompetencyRatingSliders = extQuerySelectorAll('slate-cbl-ratings-slider');

                            // verify competency statement is shown
                            cy.get('#' + studentCompetencyRatings.getId())
                                .contains(firstCompetency.Statement)

                            expect(studentCompetencyRatingSliders).to.have.length(firstCompetency.skillIds.length);

                            const { minRating, maxRating } = studentCompetencyRatingSliders[0].getConfig();
                            // get array of visible ratings
                            const visibleRatings = Array.from({length: maxRating - minRating + 1 }, (_, i) => i + minRating)
                            const totalRatings = visibleRatings.length + 1; // 1 for menu
                            const ratingWidth = studentCompetencyRatingSliders[0].innerEl.getWidth() / totalRatings;

                            const _selectRating = (raterId, rating) => {
                                const selectedRatingPos = visibleRatings.indexOf(rating)
                                cy.get('#' + raterId)
                                    .click({ x: (ratingWidth * (selectedRatingPos + 1) + ratingWidth * .5 ), y: 5, force: true })
                            };

                            studentCompetencyRatingSliders.forEach((studentCompetencyRatingSlider, i) => {
                                _selectRating(studentCompetencyRatingSlider.innerEl.getId(), 12); // rate each skill with 12
                            });

                            // add another competency
                            const addCompetencyButton = extQuerySelector('tabpanel tab[text="Add competency"]')

                            cy.get('#' + addCompetencyButton.getId())
                                .click({ force: true })

                            cy.get('#' + competencyCodeTextfield.getId()).type(secondCompetency.Code);

                             // comptency grid should only show the competency we typed
                             cy.get('#' + competencyGrid.getId())
                                .find('table')
                                .should('have.length', 1);

                            // compentency grid should only contain one
                            cy.get('#' + competencyGrid.getId())
                                .contains(secondCompetency.Descriptor)
                                .click()

                            // triggered by clicking competency in grid
                            cy.wait('@studentCompetencyData')
                                .then(() => {
                                    studentCompetencyRatingSliders = extQuerySelectorAll(`slate-cbl-ratings-studentcompetency[title="${secondCompetency.Code}"] slate-cbl-ratings-slider`);
                                    expect(studentCompetencyRatingSliders).to.have.length(secondCompetency.skillIds.length);

                                    studentCompetencyRatingSliders.forEach((studentCompetencyRatingSlider, i) => {
                                        _selectRating(studentCompetencyRatingSlider.innerEl.getId(), 10); // rate each skill with 10
                                    });
                                })

                            cy.get('#' + addCompetencyButton.getId())
                                .click({ force: true })
                        })

                        const textarea = extQuerySelector('slate-cbl-demonstrations-demonstrationform textarea');
                        const saveBtn = extQuerySelector('button[text="Save Evidence"]');

                        // type comment into text area
                        cy.get('#' + textarea.getId())
                            .type('test test test')

                        cy.get('#' + saveBtn.getId())
                            .click({ force: true })

                        cy.wait('@saveDemonstration')
                            .should(({ xhr }) => {
                                // confirm completion %, avg, and level
                                const { data } = JSON.parse(xhr.response)
                                const savedRecord = data[0];
                                debugger;
                                // check the saved object
                                expect(savedRecord).to.have.property('StudentID')

                                const { StudentID: studentId } = savedRecord;

                                cy.get(`tr.cbl-grid-progress-row[data-competency="${firstCompetency.ID}"] td.cbl-grid-progress-cell[data-student=${studentId}]`)
                                    .within(($el) => {
                                        cy.get($el.first()).click({ force: true })

                                        // NOTE: the followoing assertions can fail if the fixture data changes
                                        cy.contains('33%') // we input 1 rating for each skill (4/12 = 33%)
                                        cy.contains('P4') // Level 4 Portfolio Progress
                                        cy.contains('12') // Avg of 12
                                    });

                                cy.get(`tr.cbl-grid-progress-row[data-competency="${secondCompetency.ID}"] td.cbl-grid-progress-cell[data-student=${studentId}]`)
                                    .within(($el) => {
                                        cy.get($el.first()).click({ force: true })

                                        // NOTE: the followoing assertions can fail if the fixture data changes
                                        cy.contains('33%') // we input 1 rating for each skill (4/12 = 33%)
                                        cy.contains('P4') // Level 4 Portfolio Progress
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
        })
    })
})