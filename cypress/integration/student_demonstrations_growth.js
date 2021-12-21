describe('Student competency growth calculation test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
    });


    it('compare growth calculations', () => {
        cy.readFile('cypress/fixtures/student-competency-calculations.json')
            .then((growthCalculationsByStudent) => {
                cy.server().route('GET', '/cbl/student-competencies*').as('studentCompetencyData');

                const compareCompetencyValues = (code, competencyCardId, {baseline, growth, average}) => {
                    // check baseline rating calculation
                    cy.get(`#${competencyCardId}`)
                        .find('span[data-ref="codeEl"]')
                        .contains(code);

                    cy.get(`#${competencyCardId}`)
                        .find('td[data-ref="baselineRatingEl"]')
                        .contains(baseline === null ? '—' : baseline);

                    cy.get(`#${competencyCardId}`)
                        .find('td[data-ref="averageEl"]')
                        .contains(average === null ? '—' : average);

                    cy.get(`#${competencyCardId}`)
                        .find('td[data-ref="growthEl"]')
                        .contains(growth === null ? '—' : (growth <= 0 ? '' : '+') + growth);

                };

                cy.visit('/cbl/dashboards/demonstrations/student').then(() => {
                    cy.withExt().then(({extQuerySelector}) => {
                        const studentUsernames = Object.keys(growthCalculationsByStudent);
                        studentUsernames.forEach(studentUsername => {
                            const studentContentAreas = Object.keys(growthCalculationsByStudent[studentUsername]);
                            studentContentAreas.forEach(studentContentArea => {
                                cy.visit(`/cbl/dashboards/demonstrations/student#${studentUsername}/${studentContentArea}`);
                                // ensure that API has loaded required data
                                cy.wait('@studentCompetencyData')
                                    .its('status')
                                    .should('eq', 200)
                                    .then(() => {

                                        const studentCompetencies = Object.keys(growthCalculationsByStudent[studentUsername][studentContentArea]);
                                        studentCompetencies.forEach(studentCompetency => {
                                            // ensure competency card elements have rendered
                                            cy.get('li.slate-demonstrations-student-competencycard')
                                                .then(() => {
                                                    const card = extQuerySelector(`slate-demonstrations-student-competencycard{getCompetency().get("Code")=="${studentCompetency}"}`);
                                                    compareCompetencyValues(`${studentCompetency}`, card.id, growthCalculationsByStudent[studentUsername][studentContentArea][studentCompetency]);
                                                });
                                        });
                                    });

                            });
                        });
                    });
                });
            });
    });
});