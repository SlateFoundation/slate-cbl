describe('Student competency growth calculation test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
    });

    const growthCalculationsByStudent = {
        student: {
            ELA: {
                1: {
                    baseline: 10,
                    average: 9.3,
                    growth: -0.8,
                    percentage: 33
                },
                2: {
                    baseline: 10,
                    average: 10.8,
                    growth: 0.8,
                    percentage: 27
                },
                6: {
                    baseline: 9.5,
                    average: 10,
                    growth: 0.5,
                    percentage: 67
                }
            }
        },
        student3: {
            ELA: {
                1: {
                    baseline: 7.3,
                    average: 7.3,
                    growth: null,
                    percentage: 33
                },
                2: {
                    baseline: null,
                    average: 7.3,
                    growth: null,
                    percentage: 40
                },
                3: {
                    baseline: 5.5,
                    average: 8,
                    growth: 2.5,
                    percentage: 100
                },
                4: {
                    baseline: 5.7,
                    average: 6.5,
                    growth: 0.8,
                    percentage: 100
                },
                5: {
                    baseline: null,
                    average: 7.4,
                    growth: null,
                    percentage: 83
                },
                6: {
                    baseline: null,
                    average: 8,
                    growth: null,
                    percentage: 33
                },
                7: {
                    baseline: 7,
                    average: 7.4,
                    growth: 0.4,
                    percentage: 63
                }
            },
            SS: {
                1: {
                    baseline: 9.4,
                    average: 9,
                    growth: -0.4,
                    percentage: 40
                },
                2: {
                    baseline: null,
                    average: 8,
                    growth: null,
                    percentage: 50
                }
            },
            SCI: {
                1: {
                    baseline: 9.1,
                    average: 9.4,
                    growth: 0.2,
                    percentage: 38
                },
                2: {
                    baseline: 9.3,
                    average: 8,
                    growth: -1.3,
                    percentage: 25
                },
                3: {
                    baseline: 9.7,
                    average: 7,
                    growth: null,
                    percentage: 33
                },
                4: {
                    baseline: 9.7,
                    average: 10,
                    growth: 0.3,
                    percentage: 67
                }
            },
            HOS: {
                4: {
                    baseline: 9,
                    average: 9.3,
                    growth: .3,
                    percentage: 100
                }
            }
        }
    };

    it('compare growth calculations', () => {
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
                .contains(growth === null ? '—' : `${growth} yr`);

        };

        cy.visit('/cbl/dashboards/demonstrations/student').then(() => {
            cy.withExt().then(({extQuerySelector}) => {
                const studentUsernames = Object.keys(growthCalculationsByStudent);
                studentUsernames.forEach(studentUsername => {
                    const studentContentAreas = Object.keys(growthCalculationsByStudent[studentUsername]);
                    studentContentAreas.forEach(studentContentArea => {
                        cy.visit(`/cbl/dashboards/demonstrations/student#${studentUsername}/${studentContentArea}`);
                        cy.wait('@studentCompetencyData').its('status').should('be', 200); // ensure that API has loaded required data

                        const studentCompetencySuffixes = Object.keys(growthCalculationsByStudent[studentUsername][studentContentArea]);
                        studentCompetencySuffixes.forEach(studentCompetencySuffix => {
                            // ensure competency card elements have rendered
                            cy.get('li.slate-demonstrations-student-competencycard')
                                .then(() => {
                                    const card = extQuerySelector(`slate-demonstrations-student-competencycard{getCompetency().get("Code")=="${studentContentArea}.${studentCompetencySuffix}"}`);

                                    compareCompetencyValues(`${studentContentArea}.${studentCompetencySuffix}`, card.id, growthCalculationsByStudent[studentUsername][studentContentArea][studentCompetencySuffix]);
                                });
                        });
                    });
                });
            });
        });
    });
});