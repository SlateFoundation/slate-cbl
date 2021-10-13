const csvtojson = require('csvtojson');

describe('Student Competencies Export', () => {

  // load fixtures that will help generate tests with require
  const { student: { ELA: studentCompetencies }} = require('../../fixtures/student-competency-calculations');

  // declare array to store data in during before for later tests
  let recordsByCompetency = {};

  // all async setup ahead of the generated tests must be done in before
  before(() => {
    cy.resetDatabase();

    cy.loginAs('admin');
    cy.visit('/exports');
    cy.contains('h2', 'Competency Progress');

    // prepare for form submission that returns back a file
    // https://on.cypress.io/intercept
    cy.intercept({
      pathname: '/exports/slate-cbl/student-competencies',
    }, (req) => {
      // instead of redirecting to the CSV file
      // and having the browser deal with it
      // download the file ourselves
      // but we cannot use Cypress commands inside the callback
      // thus we will download it later using the captured URL
      req.redirect('/exports');
    }).as('records');

    cy.get('form[action="/exports/slate-cbl/student-competencies"]').within(() => {
      cy.get('input[name=students]').type('{selectall}{backspace}student');
      cy.get('select[name=content_area]').select('English Language Arts');
      cy.get('select[name=level]').select('highest');

      cy.root().submit();
    });

    cy.wait('@records').its('request').then((req) => {
      cy.request(req)
        .then(({ body, headers }) => {
          expect(headers).to.have.property('content-type', 'text/csv; charset=utf-8')
          return csvtojson().fromString(body)
        })
        .then(records => {
          expect(records, 'One row per competency skill').to.have.length(7);

          // index records by competency
          for (const record of records) {
            recordsByCompetency[record.Competency] = record;
          }
        });
    });
  });

  // generate a test for each case in the fixture data
  for (const competency in studentCompetencies) {
    const {
      average, averageExplanation,
      growth, growthExplanation,
      progress, progressExplanation,
    } = studentCompetencies[competency];

    console.log(`student=student, competency=${competency}`, studentCompetencies[competency])

    it(`Check case for student=student, competency=${competency}`, () => {
      expect(recordsByCompetency).to.have.any.key(competency);
      const record = recordsByCompetency[competency];

      expect(record['Performance Level'], averageExplanation).to.equal(average);
      expect(String(record['Progress']*100), progressExplanation).to.equal(progress);
      expect(record['Growth'], growthExplanation).to.equal(growth);
    })
  }
})