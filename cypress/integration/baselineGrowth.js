describe('Base line growth test', () => {
  // load sample database before tests
  // before(() => {
  //   cy.resetDatabase();
  // });

  // authenticate as 'teacher' user
  beforeEach(() => {
    cy.loginAs('teacher');
  });

  it('One rating for each skill.', () => {
    // open teacher demonstrations dashboard
    cy.visit('/cbl/dashboards/demonstrations/teacher');

    // verify teacher redirect
    cy.location('hash').should('eq', '#_');

    cy.get('.slate-appcontainer-bodyWrap .slate-placeholder').contains('Select a list of students and a content area to load progress dashboard');

    cy.withExt().then(({ Ext, extQuerySelector, extQuerySelectorAll }) => {
      // get the 'Rubric' selector element

      const rubricSelector = extQuerySelector('slate-cbl-contentareaselector');


console.log(rubricSelector)

      // click the selector
      cy.get('#' + rubricSelector.el.dom.id).click();

      // verify and click first element of picker dropdown
      cy.get('#' + rubricSelector.getPicker().id + ' .x-boundlist-item')
        .contains('English Language Arts')
        .click();

      // verify hash updates
      cy.location('hash').should('eq', '#ELA');

      // get the 'Students' selector element
      const studentSelector = extQuerySelector('slate-cbl-studentslistselector');

      // click the selector
      cy.get('#' + studentSelector.el.dom.id)
        .click()
        .focused()
        .type('EXA');

      // verify and click first element of picker dropdown
      cy.get('#' + studentSelector.getPicker().id + ' .x-boundlist-item')
        .contains('Example School')
        .click();

      // verify hash updates
      cy.location('hash').should('eq', '#ELA/group:example_school');

      // verify content loads
      cy.get('.slate-demonstrations-teacher-dashboard').contains('Student Slate');

      cy.get('[data-student="27"]').click();

      // verify hash updates
      cy.location('hash').should('eq', '#student4');

      // get baseline score
      cy.get('cy.get([data-ref="baselineRatingEl"]').then(($el) => {
        const baseLineScore = $el.text();

        expect(baseLineScore).to.eq('6');
      });

      //get my growth score
      cy.get('cy.get([data-ref="growthEl"]').then(($el) => {
        const myGrowth = $el.text();

        expect(myGrowth).to.eq('0');
      });
    });
  });
});
