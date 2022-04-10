const csvtojson = require('csvtojson');

before(() => {
    cy.resetDatabase();
});

describe('Check API data against test cases', () => {
    const testCases = require('../fixtures/student-competency-calculations.json');

    beforeEach(() => {
        cy.loginAs('teacher');
    });

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
                }).then(({ headers, body }) => {
                    expect(headers).to.have.property('content-type', 'application/json; charset=utf-8');
                    expect(body).to.have.an('object');
                    expect(body).to.have.property('data');
                    expect(body.data).to.be.an('array');
                    return body.data;
                }).then(studentCompetencies => {
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

                        expect(latestByCompetency, testCase.description).to.have.property(competency);
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

describe('Check CSV data against test cases', () => {
    const testCases = require('../fixtures/student-competency-calculations.json');

    beforeEach(() => {
        cy.loginAs('admin');
    });

    for (const studentUsername in testCases) {
        for (const contentArea in testCases[studentUsername]) {
            const competencyTestCases = testCases[studentUsername][contentArea];

            specify(`${studentUsername} data in ${contentArea} matches test cases`, () => {
                cy.request({
                    url: '/exports/slate-cbl/student-competencies',
                    qs: {
                        students: studentUsername,
                        content_area: contentArea,
                        level: 'highest'
                    }
                }).then(({ headers, body }) => {
                    expect(headers).to.have.property('content-type', 'text/csv; charset=utf-8')
                    return csvtojson().fromString(body)
                }).then(rows => {
                    // index rows by competency
                    const rowsByCompetency = {};
                    for (const row of rows) {
                        rowsByCompetency[row.Competency] = row;
                    }

                    // check each test case
                    for (const competency in competencyTestCases) {
                        const testCase = competencyTestCases[competency];

                        expect(rowsByCompetency, testCase.description).to.have.property(competency);
                        const row = rowsByCompetency[competency];

                        expect(
                            row['Baseline'],
                            testCase.baselineExplanation || `${competency} baseline`
                        ).to.equal(testCase.baseline === null ? '' : testCase.baseline);

                        expect(
                            row['Progress'],
                            testCase.progressExplanation || `${competency} progress`
                        ).to.equal(testCase.progress === null ? '' : `${parseFloat(testCase.progress)/100}`);

                        expect(
                            row['Growth'],
                            testCase.growthExplanation || `${competency} growth`
                        ).to.equal(testCase.growth === null ? '' : testCase.growth);

                        expect(
                            row['Performance Level'],
                            testCase.averageExplanation || `${competency} average`
                        ).to.equal(testCase.average === null ? '' : testCase.average);
                    }
                });
            });
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
    });
});