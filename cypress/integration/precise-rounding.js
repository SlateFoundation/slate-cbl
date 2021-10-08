const csvtojson = require('csvtojson');
const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');

dayjs.extend(isBetween);

const testCaseOne = {
    student: 'student5',
    contentArea: 'ELA',
    competency: 7,
    baseline: 5,
    growth: 1.3,
    progress: 63,
    performanceLevel: 6.2
};

const testCaseTwo = {
    student: 'student4',
    contentArea: 'ELA',
    competency: 1,
    baseline: 6,
    growth: 0,
    progress: 33,
    performanceLevel: 6
};

const testCaseThree = {
    student: 'student4',
    contentArea: 'ELA',
    competency: 2,
    baseline: null,
    growth: null,
    progress: 40,
    performanceLevel: 6
};

const testCaseFour = {
    student: 'student4',
    contentArea: 'ELA',
    competency: 3,
    baseline: 6,
    growth: 1,
    progress: 100,
    performanceLevel: 7
};

const testCaseFive = {
    student: 'student4',
    contentArea: 'ELA',
    competency: 4,
    baseline: 6,
    growth: 0.7,
    progress: 100,
    performanceLevel: 6.7
};

const testCaseSix = {
    student: 'student4',
    contentArea: 'ELA',
    competency: 5,
    baseline: 6,
    growth: 1,
    progress: 83,
    performanceLevel: 7
};

const testCaseSeven = {
    student: 'student4',
    contentArea: 'ELA',
    competency: 6,
    baseline: null,
    growth: null,
    progress: 33,
    performanceLevel: 7
};

const testCaseEight = {
    student: 'student4',
    contentArea: 'ELA',
    competency: 7,
    baseline: 6,
    growth: 0.4,
    progress: 63,
    performanceLevel: 6.4
};

const testCaseNine = {
    student: 'student4',
    contentArea: 'SCI',
    competency: 1,
    baseline: 6.9,
    growth: -0.3,
    progress: 38,
    performanceLevel: 6.6
};

const testCaseTen = {
    student: 'student4',
    contentArea: 'NGE',
    competency: 1,
    baseline: null,
    growth: null,
    progress: 35,
    performanceLevel: 9.4
};

const testCaseEleven = {
    student: 'student4',
    contentArea: 'HOS',
    competency: 1,
    baseline: 8.3,
    growth: 0.8,
    progress: 45,
    performanceLevel: 9.1
};

const testCaseTwelve = {
    student: 'student4',
    contentArea: 'HW',
    competency: 1,
    baseline: 8,
    growth: 0,
    progress: 33,
    performanceLevel: 8
};

const testCaseThirteen = {
    student: 'student4',
    contentArea: 'HW',
    competency: 2,
    baseline: null,
    growth: null,
    progress: 42,
    performanceLevel: 8.4
};

const testCaseFourteen = {
    student: 'student4',
    contentArea: 'HW',
    competency: 3,
    baseline: 8,
    growth: 1.2,
    progress: 56,
    performanceLevel: 9.2
};

const testCaseFifteen = {
    student: 'student4',
    contentArea: 'SCI',
    competency: 3,
    baseline: null,
    growth: null,
    progress: "0",
    performanceLevel: "-"
};

describe('Confirm rounding is consistent across UI, API, and exports', () => {

    // API Tests
    const checkAPIDataAgainstDocsTestData = ({student, contentArea, competency, baseline, growth, progress, performanceLevel}) => {
        cy.loginAs('teacher');
        cy.server().route('GET', '/cbl/student-competencies*').as('studentCompetencyData');
        cy.visit(`/cbl/dashboards/demonstrations/student#${student}/${contentArea}`);
        // ensure that API has loaded required data
        cy.wait('@studentCompetencyData')

        .should(({ xhr }) => {
            const data = JSON.parse(xhr.response).data
            const studentData = data.filter((datum)=> datum.CompetencyID === competency);
            const expectedBaseLine =  studentData[0].BaselineRating
            const expectedGrowth = studentData[0].growth
            const expectedPerformanceLevel = studentData[0].demonstrationsAverage

            cy.wrap(xhr).its('status').should('eq', 200);

            expect(expectedBaseLine,
                `${contentArea}.${competency} for ${student} API Baseline Value ${expectedBaseLine}: Test Doc Baseline Value ${baseline}`
            ).to.equal(baseline);

            expect(expectedGrowth,
                `${contentArea}.${competency} for ${student} API Growth Value ${expectedGrowth}: Test Doc Growth Value ${growth}`
            ).to.equal(growth);

            // API doesnt have a progress property
            // expect(    ,
            //     `${contentArea}.${competency} for ${student} API Completion Percentage Value ${expectedProgress}: Test Doc Completion Percentage Value ${progress}`
            //     ).to.equal(progress);

            expect(expectedPerformanceLevel,
                `${contentArea}.${competency} for ${student}  API Performance Level Value ${expectedPerformanceLevel}: Test Doc Perfomance Level Value ${performanceLevel}`
                ).to.equal(performanceLevel);
         });
    };

    // UI Tests
    const checkUIDataAgainstDocsTestData = (code, competencyCardId, { baseline, growth, progress, performanceLevel }) => {
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
            .contains(growth === null ? '—' : `${growth} yr`);
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

  const getAndDisplayUIData = ({student, contentArea, competency, baseline, growth, progress, performanceLevel}) => {
        cy.loginAs('teacher');
        cy.server().route('GET', '/cbl/student-competencies*').as('studentCompetencyData');
        cy.visit(`/cbl/dashboards/demonstrations/student#${student}/${contentArea}`);
        // ensure that API has loaded required data
        cy.wait('@studentCompetencyData')
        .then(() => {
            cy.wait(500); // wait for dom to render
            // ensure competency card elements have rendered
            cy.get('li.slate-demonstrations-student-competencycard')
                .then(() => {
                    cy.withExt().then(({extQuerySelector}) => {
                        const card = extQuerySelector(`slate-demonstrations-student-competencycard{getCompetency().get("Code")=="${contentArea}.${competency}"}`);

                        checkUIDataAgainstDocsTestData(`${contentArea}.${competency}`, card.id, {
                            baseline,
                            growth,
                            progress,
                            performanceLevel
                        });
                    });
                });
        });
  };

    // CSV Tests
    const checkCSVDataAgainstDocsTestData = ({student, contentArea, competency, baseline, growth, progress, performanceLevel} ) => {
        cy.loginAs('admin');
        cy.visit('/exports');

        // prepare for form submission that returns back a file
        // https://on.cypress.io/intercept
        cy.intercept({ pathname: '/exports/slate-cbl/student-competencies'}, (req) => {
            req.redirect('/exports')
        }).as('records');

        cy.get('form[action="/exports/slate-cbl/student-competencies"]').within(() => {
            cy.get('input[name=students]').type(`{selectall}{backspace}${student}`);
            cy.get('select[name=content_area]').select(contentArea);
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
                return record.Competency === `${contentArea}.${competency}`
            });

            const expectedPerformanceLevel = +studentCompetencyRow[0]['Performance Level']
            const expectedGrowth =  +studentCompetencyRow[0]['Growth']
            const expectedBaseLine = +studentCompetencyRow[0]['Baseline']
            const expectedProgress = +studentCompetencyRow[0]['Progress']

            expect(expectedPerformanceLevel,
            `${contentArea}.${competency} for ${student}  CSV Performance Level Value ${expectedPerformanceLevel}: Test Doc Perfomance Level Value ${performanceLevel}`
            ).to.equal(performanceLevel);

            expect(expectedGrowth,
                `${contentArea}.${competency} for ${student} CSV Growth Value ${expectedGrowth}: Test Doc Growth Value ${growth}`
            ).to.equal(growth);

            expect(expectedBaseLine,
                `${contentArea}.${competency} for ${student} CSV Baseline Value ${expectedBaseLine}: Test Doc Baseline Value ${baseline}`
            ).to.equal(baseline);

            expect(expectedProgress,
                `${contentArea}.${competency} for ${student} CSV Completion Percentage Value ${expectedProgress}: Test Doc Completion Percentage Value ${progress}`
                ).to.equal(progress/100); // progress is represented as decimal in export
        });
        });
    };


  it('Student 5 ELA Competency 7', () => {
      checkAPIDataAgainstDocsTestData(testCaseOne);
      getAndDisplayUIData(testCaseOne);
      checkCSVDataAgainstDocsTestData(testCaseOne);
    });

    it('One rating for each skill.', () => {
       checkAPIDataAgainstDocsTestData(testCaseTwo);
       getAndDisplayUIData(testCaseTwo);
       checkCSVDataAgainstDocsTestData(testCaseTwo);
    });

    it('One rating for all but one skill, progress < 50%', () => {
        checkAPIDataAgainstDocsTestData(testCaseThree);
        getAndDisplayUIData(testCaseThree);
        checkCSVDataAgainstDocsTestData(testCaseThree);
    });

    it('One set of ERs thats low and hidden and one that is higher and displayed', () => {
        checkAPIDataAgainstDocsTestData(testCaseFour);
        getAndDisplayUIData(testCaseFour);
        checkCSVDataAgainstDocsTestData(testCaseFour);
    });

    it('One set of ER thats low and hidden and one that is higher and displayed with Ms', () => {
        checkAPIDataAgainstDocsTestData(testCaseFive);
        getAndDisplayUIData(testCaseFive);
        checkCSVDataAgainstDocsTestData(testCaseFive);
    });

    it('No full set of ER, Progress > 50%', () => {
        checkAPIDataAgainstDocsTestData(testCaseSix);
        getAndDisplayUIData(testCaseSix);
        checkCSVDataAgainstDocsTestData(testCaseSix);
    });

    it('One rating for each skill except one which is an M', () => {
        checkAPIDataAgainstDocsTestData(testCaseSeven);
        getAndDisplayUIData(testCaseSeven);
        checkCSVDataAgainstDocsTestData(testCaseSeven);
    });

    it('One full ER plus one additional rating', () => {
        checkAPIDataAgainstDocsTestData(testCaseEight);
        getAndDisplayUIData(testCaseEight);
        checkCSVDataAgainstDocsTestData(testCaseEight);
    });

    it('One full ER plus one additional rating, less than 50%', () => {
        checkAPIDataAgainstDocsTestData(testCaseNine);
        getAndDisplayUIData(testCaseNine);
        checkCSVDataAgainstDocsTestData(testCaseNine);
    });

    it('No full set of ERs, Progress < 50%', () => {
        checkAPIDataAgainstDocsTestData(testCaseTen);
        getAndDisplayUIData(testCaseTen);
        checkCSVDataAgainstDocsTestData(testCaseTen);
    });

    it('No full set of ER, Progress >= 50%', () => {
        checkAPIDataAgainstDocsTestData(testCaseEleven);
        getAndDisplayUIData(testCaseEleven);
        checkCSVDataAgainstDocsTestData(testCaseEleven);
    });

    it('One full ER, HW.1.4 is set to zero ER', () => {
        checkAPIDataAgainstDocsTestData(testCaseTwelve);
        getAndDisplayUIData(testCaseTwelve);
        checkCSVDataAgainstDocsTestData(testCaseTwelve);
    });

    it('No full set of ER, HW.2.5 is set to zero ER, Progress < 50%', () => {
        checkAPIDataAgainstDocsTestData(testCaseThirteen);
        getAndDisplayUIData(testCaseThirteen);
        checkCSVDataAgainstDocsTestData(testCaseThirteen);
    });

    it('No full set of ER, HW3.4 is set to zero ER, Progress >= 50%', () => {
        checkAPIDataAgainstDocsTestData(testCaseFourteen);
        getAndDisplayUIData(testCaseFourteen);
        checkCSVDataAgainstDocsTestData(testCaseFourteen);
    });

    it('All Ms', () => {
        checkAPIDataAgainstDocsTestData(testCaseFifteen);
        getAndDisplayUIData(testCaseFifteen);
        checkCSVDataAgainstDocsTestData(testCaseFifteen);
    });
});