const csvtojson = require('csvtojson');
const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');

dayjs.extend(isBetween);



describe('Confirm rounding is consistent across UI, API, and exports', () => {

  it('Student 5 ELA Competency 7', () => {
      checkAPIDataAgainstTestCase(testCaseOne);
      getAndDisplayUIData(testCaseOne);
      checkCSVDataAgainstTestCase(testCaseOne);
    });

    it('One rating for each skill.', () => {
       checkAPIDataAgainstTestCase(testCaseTwo);
       getAndDisplayUIData(testCaseTwo);
       checkCSVDataAgainstTestCase(testCaseTwo);
    });

    it('One rating for all but one skill, progress < 50%', () => {
        checkAPIDataAgainstTestCase(testCaseThree);
        getAndDisplayUIData(testCaseThree);
        checkCSVDataAgainstTestCase(testCaseThree);
    });

    it('One set of ERs thats low and hidden and one that is higher and displayed', () => {
        checkAPIDataAgainstTestCase(testCaseFour);
        getAndDisplayUIData(testCaseFour);
        checkCSVDataAgainstTestCase(testCaseFour);
    });

    it('One set of ER thats low and hidden and one that is higher and displayed with Ms', () => {
        checkAPIDataAgainstTestCase(testCaseFive);
        getAndDisplayUIData(testCaseFive);
        checkCSVDataAgainstTestCase(testCaseFive);
    });

    it('No full set of ER, Progress > 50%', () => {
        checkAPIDataAgainstTestCase(testCaseSix);
        getAndDisplayUIData(testCaseSix);
        checkCSVDataAgainstTestCase(testCaseSix);
    });

    it('One rating for each skill except one which is an M', () => {
        checkAPIDataAgainstTestCase(testCaseSeven);
        getAndDisplayUIData(testCaseSeven);
        checkCSVDataAgainstTestCase(testCaseSeven);
    });

    it('One full ER plus one additional rating', () => {
        checkAPIDataAgainstTestCase(testCaseEight);
        getAndDisplayUIData(testCaseEight);
        checkCSVDataAgainstTestCase(testCaseEight);
    });

    it('One full ER plus one additional rating, less than 50%', () => {
        checkAPIDataAgainstTestCase(testCaseNine);
        getAndDisplayUIData(testCaseNine);
        checkCSVDataAgainstTestCase(testCaseNine);
    });

    it('No full set of ERs, Progress < 50%', () => {
        checkAPIDataAgainstTestCase(testCaseTen);
        getAndDisplayUIData(testCaseTen);
        checkCSVDataAgainstTestCase(testCaseTen);
    });

    it('No full set of ER, Progress >= 50%', () => {
        checkAPIDataAgainstTestCase(testCaseEleven);
        getAndDisplayUIData(testCaseEleven);
        checkCSVDataAgainstTestCase(testCaseEleven);
    });

    it('One full ER, HW.1.4 is set to zero ER', () => {
        checkAPIDataAgainstTestCase(testCaseTwelve);
        getAndDisplayUIData(testCaseTwelve);
        checkCSVDataAgainstTestCase(testCaseTwelve);
    });

    it('No full set of ER, HW.2.5 is set to zero ER, Progress < 50%', () => {
        checkAPIDataAgainstTestCase(testCaseThirteen);
        getAndDisplayUIData(testCaseThirteen);
        checkCSVDataAgainstTestCase(testCaseThirteen);
    });

    it('No full set of ER, HW3.4 is set to zero ER, Progress >= 50%', () => {
        checkAPIDataAgainstTestCase(testCaseFourteen);
        getAndDisplayUIData(testCaseFourteen);
        checkCSVDataAgainstTestCase(testCaseFourteen);
    });

    it('All Ms', () => {
        checkAPIDataAgainstTestCase(testCaseFifteen);
        getAndDisplayUIData(testCaseFifteen);
        checkCSVDataAgainstTestCase(testCaseFifteen);
    });
});



   // API Tests
   const checkAPIDataAgainstTestCase = ({student, contentArea, competency, baseline, growth, progress, performanceLevel}) => {
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

                    checkUIDataAgainstTestCase(`${contentArea}.${competency}`, card.id, {
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
const checkCSVDataAgainstTestCase = ({student, contentArea, competency, baseline, growth, progress, performanceLevel} ) => {
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