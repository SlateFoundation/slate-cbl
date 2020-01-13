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
                        cy.visit(`/cbl/dashboards/demonstrations/student#${studentUsername}/${studentContentArea}`)
                            .then(() => {
                                cy.wait(5000).then(() => {
                                    const studentCompetencySuffixes = Object.keys(growthCalculationsByStudent[studentUsername][studentContentArea]);

                                    studentCompetencySuffixes.forEach(studentCompetencySuffix => {

                                        const card = extQuerySelector(`slate-demonstrations-student-competencycard{getCompetency().get("Code")=="${studentContentArea}.${studentCompetencySuffix}"}`);

                                        let {id: competencyCardId} = card;

                                        compareCompetencyValues(`${studentContentArea}.${studentCompetencySuffix}`, competencyCardId, growthCalculationsByStudent[studentUsername][studentContentArea][studentCompetencySuffix]);
                                    });
                                });
                            });
                    });
                });
            });
        });
    });
});


                // cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {
                //     // const competencySummaryCardId = '.slate-demonstrations-student-competenciessummary';

                //     for (let i = 0; i < Object.keys(growthCalculationsByStudent[studentUsername][firstContentArea]).length; i++) {

                //         const code = competencies[i],
                //             expectedValues = expectedCompetencyValues[i],
                //             competencyCard = getCompetencyCard(code),
                //             {id: competencyCardId} = competencyCard;


                //         // cy.get(competencyCardId)
                //         //     .find('div[data-ref="meterPercentEl"]')
                //         //     .contains('67%');

                //     }
                // });

// it('View sample students progress', () => {

//     // open student demonstrations dashboard
//     cy.visit(`/cbl/dashboards/demonstrations/student#${studentUsername}/${contentAreaCode}`);

//     // verify teacher redirect
//     cy.get('.slate-demonstrations-student-competenciessummary .slate-simplepanel-title')
//         .contains('English Language Arts');

//     cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {
//         const getCompetencyCard = code => {
//             return extQuerySelector(`slate-demonstrations-student-competencycard{getCompetency().get("Code")=="${code}"}`);
//         };

//         // validate section overview metrics
//         var competencySummaryCardId = '.slate-demonstrations-student-competenciessummary';

//         // cy.get(competencySummaryCardId)
//         //     .find('div[data-ref="meterPercentEl"]')
//         //     .contains('59%');

//         // cy.get(competencySummaryCardId)
//         //     .find('td[data-ref="missedEl"]')
//         //     .contains('1');

//         // cy.get(competencySummaryCardId)
//         //     .find('td[data-ref="averageEl"]')
//         //     .contains('7.4');

//         // cy.get(competencySummaryCardId)
//         //     .find('td[data-ref="growthEl"]')
//         //     .contains('1 yr');

//         // const competencies = [
//         //     'ELA.1',
//         //     'ELA.2',
//         //     'ELA.3',
//         //     'ELA.4',
//         //     'ELA.5',
//         //     'ELA.6',
//         //     'ELA.7',
//         // ];
//         // const expectedCompetencyValues = [
//         //     {baseline: 7.3, performanceLevel: 7.3, growth: null},
//         //     {baseline: null, performanceLevel: 7.3, growth: null},
//         //     {baseline: 5.5, performanceLevel: 8, growth: 2.5},
//         //     {baseline: 5.7, performanceLevel: 6.5, growth: 0.8},
//         //     {baseline: null, performanceLevel: 7.4, growth: null},
//         //     {baseline: null, performanceLevel: 8, growth: null},
//         //     {baseline: 7, performanceLevel: 7.4, growth: 0.4}
//         // ];



//         // validate Demonstration Metrics
//         // var competencyCard = extQuerySelector('slate-demonstrations-student-competencycard{getCompetency().get("Code")=="ELA.6"}');
//         // var competencyCardId = '#' + competencyCard.id;

//     });
// });