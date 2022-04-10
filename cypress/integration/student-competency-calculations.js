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

describe('Check UI data against test cases', () => {
    const testCases = require('../fixtures/student-competency-calculations.json');

    beforeEach(() => {
        cy.loginAs('teacher');
    });

    for (const studentUsername in testCases) {
        for (const contentArea in testCases[studentUsername]) {
            const competencyTestCases = testCases[studentUsername][contentArea];

            specify(`${studentUsername} data in ${contentArea} matches test cases`, () => {
                cy.intercept('/cbl/student-competencies?*').as('getStudentCompetencies');
                cy.visit(`/cbl/dashboards/demonstrations/student#${studentUsername}/${contentArea}`);
                cy.wait('@getStudentCompetencies');

                // check each test case
                for (const competency in competencyTestCases) {
                    const testCase = competencyTestCases[competency];

                    cy.log(testCase.description);

                    cy.extGet(`slate-demonstrations-student-competencycard{getCompetency().get("Code")=="${competency}"}`)
                        .should('have.nested.property', 'el.dom')
                        .within(() => {
                            cy.get('span[data-ref="codeEl"]')
                                .should('have.text', competency);

                            cy.get('div[data-ref="meterPercentEl"]')
                                .should('have.text', testCase.progress === null ? '—' : `${testCase.progress}%`);

                            cy.get('td[data-ref="baselineRatingEl"]')
                                .should('have.text', testCase.baseline === null ? '—' : testCase.baseline);

                            cy.get('td[data-ref="averageEl"]')
                                .should('have.text', testCase.average === null ? '—' : testCase.average);

                            cy.get('td[data-ref="growthEl"]')
                                .should('have.text', testCase.growth === null ? '—' : `${testCase.growth <= 0 ? '' : '+'}${testCase.growth}`);
                    });
                }
            });
        }
    }
});