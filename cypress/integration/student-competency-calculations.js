const csvtojson = require('csvtojson');

before(() => {
    cy.resetDatabase();
});

beforeEach(() => {
    cy.loginAs('teacher');
})

describe('Check API data against test cases', () => {
    const testCases = require('../fixtures/student-competency-calculations.json');

    for (const studentUsername in testCases) {
        for (const contentArea in testCases[studentUsername]) {
            const competencyTestCases = testCases[studentUsername][contentArea];

            specify(`${studentUsername} data in ${contentArea} matches test cases`, () => {
                cy.request({
                    url: '/cbl/student-competencies',
                    qs: {
                        format: 'json',
                        include: [
                            'Competency',
                            'growth',
                            'progress',
                            'demonstrationsAverage',
                            'baselineAverage'
                        ],
                        student: studentUsername,
                        content_area: contentArea
                    }
                }).its('body.data').then(studentCompetencies => {
                    // find highest-level per competency
                    const latestByCompetency = {};
                    for (const studentCompetency of studentCompetencies) {
                        const competency = studentCompetency.Competency.Code;
                        if (
                            !(competency in latestByCompetency)
                            || latestByCompetency[competency].Level < studentCompetency.Level
                        ) {
                            latestByCompetency[competency] = studentCompetency;
                        }
                    }

                    // check each test case
                    for (const competency in competencyTestCases) {
                        const testCase = competencyTestCases[competency];

                        expect(latestByCompetency).to.have.property(competency);
                        const latest = latestByCompetency[competency];

                        expect(
                            latest.baselineAverage,
                            testCase.baselineExplanation || `${competency} baseline`
                        ).to.equal(testCase.baseline === null ? null : parseFloat(testCase.baseline));

                        expect(
                            latest.progress,
                            testCase.progressExplanation || `${competency} progress`
                        ).to.equal(testCase.progress === null ? null : parseInt(testCase.progress, 10) / 100);

                        expect(
                            latest.growth,
                            testCase.growthExplanation || `${competency} growth`
                        ).to.equal(testCase.growth === null ? null : parseFloat(testCase.growth));

                        expect(
                            latest.demonstrationsAverage,
                            testCase.averageExplanation || `${competency} average`
                        ).to.equal(testCase.average === null ? null : parseFloat(testCase.average));
                    }
                })
            })
        }
    }
});

describe('Confirm rounding is consistent across UI, API, and exports', () => {
    const testCases = require('../fixtures/student-competency-calculations.json');

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

                            // csv represents null growth as an empty string
                            expect(
                                csvGrowth === '' ? null : `${csvGrowth}`,
                                `${studentCompetencyCode} for ${studentUsername} CSV Growth Value ${csvGrowth}: Fixtures data Growth Value ${growth}`
                            ).to.equal(growth);

                            // csv represents null baseline as empty string
                            expect(
                                csvBaseLine === '' ? null : `${csvBaseLine}`,
                                `${studentCompetencyCode} for ${studentUsername} CSV Baseline Value ${csvBaseLine}: Fixtures data Baseline Value ${baseline}`
                            ).to.equal(baseline)

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