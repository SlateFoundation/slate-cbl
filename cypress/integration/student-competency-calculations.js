const csvtojson = require('csvtojson');
const testCases = require('../fixtures/student-competency-calculations.json');

describe('Confirm rounding is consistent across UI, API, and exports', () => {
    before(() => {
        cy.resetDatabase();
    });

    it('Check API Data Against Test Case', () => {
        cy.loginAs('teacher');
        cy.server().route('GET', '/cbl/student-competencies*').as('studentCompetencyData');
        cy.visit(`/cbl/dashboards/demonstrations/student`).then(()=>{
            const studentUsernames = Object.keys(testCases);
            studentUsernames.forEach(studentUsername =>{
                const studentContentAreas = Object.keys(testCases[studentUsername])
                studentContentAreas.forEach(studentContentArea => {
                    cy.visit(`/cbl/dashboards/demonstrations/student#${studentUsername}/${studentContentArea}`);

                    // ensure that API has loaded required data
                    cy.wait('@studentCompetencyData')
                    .should(({ xhr }) => {
                        const studentCompetencyCodes = Object.keys(testCases[studentUsername][studentContentArea]);
                        studentCompetencyCodes.forEach(studentCompetencyCode => {
                            const { data, ContentArea: { Competencies: competencies } } = JSON.parse(xhr.response)      
                            const { ID: competencyId } = competencies.filter(datum => datum.Code === `${studentCompetencyCode}`).pop()
                            const studentData = data.filter(datum => datum.CompetencyID === competencyId) // filter by CompetencyID
                            .sort((sc1, sc2) => sc1.Level - sc2.Level).pop(); // sort by highest level last, and use that
                            expect(studentData).to.not.be.null;
                            const apiBaseLine =  studentData.BaselineRating ? Math.round(studentData.BaselineRating * 10) / 10 : studentData.BaselineRating
                            const apiGrowth = studentData.growth
                            const apiProgress = studentData.demonstrationsRequired ? (
                                studentData.demonstrationsComplete ?
                                    Math.round(studentData.demonstrationsComplete / studentData.demonstrationsRequired * 100) :
                                    0
                            ) : 1;
                            const apiPerformanceLevel = studentData.demonstrationsAverage
                            cy.wrap(xhr).its('status').should('eq', 200);
                            //convert api baseline to string, if it is not null
                            expect(
                              apiBaseLine ? `${apiBaseLine}` : apiBaseLine,
                              `${studentCompetencyCode} for ${studentUsername} API Baseline Value ${apiBaseLine}: Fixtures data Baseline Value ${testCases[studentUsername][studentContentArea][studentCompetencyCode].baseline}`
                            ).to.equal(
                              testCases[studentUsername][studentContentArea][
                                studentCompetencyCode
                              ].baseline
                            );

                            // convert api growth to string
                            expect(
                              `${apiGrowth}`,
                              `${studentCompetencyCode} for ${studentUsername} API Growth Value ${apiGrowth}: Fixtures data Growth Value ${testCases[studentUsername][studentContentArea][studentCompetencyCode].growth}`
                            ).to.equal(
                              testCases[studentUsername][studentContentArea][
                                studentCompetencyCode
                              ].growth
                            );

                            // convert api calculated progress into string
                            expect(
                              `${apiProgress}`,
                              `${studentCompetencyCode} for ${studentUsername} API Completion Percentage Value ${apiProgress}: Fixtures data Completion Percentage Value ${testCases[studentUsername][studentContentArea][studentCompetencyCode].progress}`
                            ).to.equal(
                              testCases[studentUsername][studentContentArea][
                                studentCompetencyCode
                              ].progress
                            );

                            // compare null comparisons without converting to string
                            expect(
                              apiPerformanceLevel === null
                                ? apiPerformanceLevel
                                : `${apiPerformanceLevel}`,
                              `${studentCompetencyCode} for ${studentUsername}  API Performance Level Value ${apiPerformanceLevel}: Fixtures data Perfomance Level Value ${testCases[studentUsername][studentContentArea][studentCompetencyCode].average}`
                            ).to.equal(
                              testCases[studentUsername][studentContentArea][
                                studentCompetencyCode
                              ].average
                            );
                        })
                    })
                })
            })
        })
    })


    it('Check UI Data Against Test Case', () => {
        cy.loginAs('teacher');
        cy.server().route('GET', '/cbl/student-competencies*').as('studentCompetencyData');
        cy.visit(`/cbl/dashboards/demonstrations/student`).then(()=>{
            const studentUsernames = Object.keys(testCases);
            studentUsernames.forEach(studentUsername =>{
                const studentContentAreas = Object.keys(testCases[studentUsername])
                studentContentAreas.forEach(studentContentArea => {
                    cy.visit(`/cbl/dashboards/demonstrations/student#${studentUsername}/${studentContentArea}`);
                    cy.wait('@studentCompetencyData')
                    .then(() => {
                        cy.wait(500); // wait for dom to render

                        // ensure competency card elements have rendered
                        const studentCompetencyCodes = Object.keys(testCases[studentUsername][studentContentArea]);
                        studentCompetencyCodes.forEach(studentCompetencyCode => {
                            cy.get('li.slate-demonstrations-student-competencycard')
                                .then(() => {
                                    cy.withExt().then(({extQuerySelector}) => {
                                        const card = extQuerySelector(`slate-demonstrations-student-competencycard{getCompetency().get("Code")=="${studentCompetencyCode}"}`);
                                        const baseline = testCases[studentUsername][studentContentArea][studentCompetencyCode].baseline
                                        const growth = testCases[studentUsername][studentContentArea][studentCompetencyCode].growth
                                        const progress = testCases[studentUsername][studentContentArea][studentCompetencyCode].progress
                                        const performanceLevel = testCases[studentUsername][studentContentArea][studentCompetencyCode].performanceLevel
                                        checkUIDataAgainstTestCase(`${studentCompetencyCode}`, card.id, {
                                            baseline,
                                            growth,
                                            progress,
                                            performanceLevel
                                        });
                                    });
                                });
                        })
                    });

                })
            })
        })

        const checkUIDataAgainstTestCase = (code, competencyCardId, { baseline, growth, progress, performanceLevel }) => {

            // check baseline rating calculation
            cy.get(`#${competencyCardId}`)
                .find('span[data-ref="codeEl"]')
                .contains(code);

            if (baseline !== undefined) {
                cy.get(`#${competencyCardId}`)
                .find('td[data-ref="baselineRatingEl"]')
                .contains(baseline === null ? '—' : baseline);
            };

            if (growth !== undefined) {
                cy.get(`#${competencyCardId}`)
                .find('td[data-ref="growthEl"]')
                .contains(growth === null ? '—' : (growth <= 0 ? '' : '+') + growth);
            }

            if (progress !== undefined) {
                cy.get(`#${competencyCardId}`)
                .find('div[data-ref="meterPercentEl"]')
                .contains(progress === null ? '—' : progress);
            };

            if (performanceLevel !== undefined) {
                cy.get(`#${competencyCardId}`)
                .find('td[data-ref="averageEl"]')
                .contains(performanceLevel === null ? '—' : performanceLevel);
            };
        };
    })


    it('Check CSV Data Against Test Case', () => {
        cy.loginAs('admin');
        cy.visit('/exports');

        // prepare for form submission that returns back a file
        // https://on.cypress.io/intercept
        cy.intercept({ pathname: '/exports/slate-cbl/student-competencies'}, (req) => {
            req.redirect('/exports')
        }).as('records');

        const studentUsernames = Object.keys(testCases);
        studentUsernames.forEach(studentUsername =>{
            const studentContentAreas = Object.keys(testCases[studentUsername])
            studentContentAreas.forEach(studentContentArea => {
                const studentCompetencyCodes = Object.keys(testCases[studentUsername][studentContentArea]);
                studentCompetencyCodes.forEach(studentCompetencyCode => {
                    cy.get('form[action="/exports/slate-cbl/student-competencies"]').within(() => {
                        cy.get('input[name=students]').clear().type(`${studentUsername}`);
                        cy.get('select[name=content_area]').select(studentContentArea);
                        cy.get('select[name=level]').select('highest');
                        cy.root().submit();
                    });
                    cy.wait('@records').its('request').then((req) => {
                        cy.request(req)
                        .then(({ body, headers }) => {
                            expect(headers).to.have.property('content-type', 'text/csv; charset=utf-8')
                            return csvtojson().fromString(body)
                        }).then((records) => {
                            const studentCompetencyRow = records.filter((record)=> {
                                return record.Competency === `${studentCompetencyCode}`
                            }).pop();
                            
                            const csvPerformanceLevel = studentCompetencyRow['Performance Level']
                            const csvGrowth = studentCompetencyRow.Growth
                            const csvBaseLine = studentCompetencyRow.Baseline
                            const csvProgress = studentCompetencyRow.Progress
                            const baseline = testCases[studentUsername][studentContentArea][studentCompetencyCode].baseline
                            const growth = testCases[studentUsername][studentContentArea][studentCompetencyCode].growth
                            const progress = testCases[studentUsername][studentContentArea][studentCompetencyCode].progress
                            const performanceLevel = testCases[studentUsername][studentContentArea][studentCompetencyCode].average;

                            // csv represents null as empty string
                            expect(csvPerformanceLevel === '' ? null : csvPerformanceLevel,
                                `${studentCompetencyCode} for ${studentUsername}  CSV Performance Level Value ${csvPerformanceLevel}: Fixtures data Perfomance Level Value ${performanceLevel}`
                            ).to.equal(performanceLevel);

                            // csv represents 0 growth as an empty string
                            expect(`${csvGrowth === '' ? 0 : csvGrowth}`,
                                `${studentCompetencyCode} for ${studentUsername} CSV Growth Value ${csvGrowth}: Fixtures data Growth Value ${growth}`
                            ).to.equal(growth);

                            // if csv value = 0, baseline could = NULL OR 0.
                            // this needs to be resolved -- the CSV should probably differentiate
                            if (csvBaseLine === '0') {
                                expect(baseline,
                                    `${studentCompetencyCode} for ${studentUsername} CSV Baseline Value ${csvBaseLine}: Fixtures data Baseline Value ${baseline}`
                                ).to.be.oneOf(['0', null])
                            } else {
                                expect(`${csvBaseLine}`,
                                    `${studentCompetencyCode} for ${studentUsername} CSV Baseline Value ${csvBaseLine}: Fixtures data Baseline Value ${baseline}`
                                ).to.equal(baseline);
                            }

                            // csv represents 0 progress as empty string
                            if (csvProgress === '') {
                                expect(progress,
                                    `${studentCompetencyCode} for ${studentUsername} CSV Completion Percentage Value ${csvProgress}: Fixtures data Completion Percentage Value ${progress}`
                                ).to.equal('0'); // progress is represented as decimal in export
                            } else {
                                expect(`${csvProgress}`,
                                    `${studentCompetencyCode} for ${studentUsername} CSV Completion Percentage Value ${csvProgress}: Fixtures data Completion Percentage Value ${progress}`
                                ).to.equal(`${progress/100}`); // progress is represented as decimal in export
                            }

                        })
                    })
                })
            })
        })
    })
})