const csvtojson = require('csvtojson');

describe('Student Competencies Export', () => {
  it('Download and Verify Student Competencies Export via Form', () => {
    cy.loginAs('admin');
    cy.visit('/exports')
      cy.contains('h2', 'Competency Progress')

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
        req.redirect('/exports')
      }).as('records')

      cy.get('form[action="/exports/slate-cbl/student-competencies"]').within(() => {
        cy.get('input[name=students]').type('{selectall}{backspace}student');
        cy.get('select[name=content_area]').select('English Language Arts');
        cy.get('select[name=level]').select('highest');

        cy.root().submit();
      })

      cy.wait('@records').its('request').then((req) => {
        cy.request(req)
        .then(({ body, headers }) => {
          expect(headers).to.have.property('content-type', 'text/csv; charset=utf-8')
          return csvtojson().fromString(body)
        }).then((records) => {
          expect(records).to.have.length(7); // One per competency
          // ELA.1 for student has Performance Level 9.3 ((8+9+10+10)/4 = 9.25 rounded to 9.3)
          expect(records[0]['Performance Level']).to.equal('9.3');
          // ELA.2 for student has Performance Level 9.3 ((11+11+11+10)/4 = 10.75 rounded to 10.8)
          expect(records[1]['Performance Level']).to.equal('10.8');
        })
      })
  })
})