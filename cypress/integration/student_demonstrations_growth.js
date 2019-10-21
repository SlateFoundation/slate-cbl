describe('Student competency growth calculation test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
    });

    it('View sample students progress', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/demonstrations/student#student/ELA');

        // verify teacher redirect
        cy.get('.slate-demonstrations-student-competenciessummary .slate-simplepanel-title')
            .contains('English Language Arts');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // validate section overview metrics
            var competencySummaryCardId = '.slate-demonstrations-student-competenciessummary';

            cy.get(competencySummaryCardId)
                .find('div[data-ref="meterPercentEl"]')
                .contains('74%');

            cy.get(competencySummaryCardId)
                .find('td[data-ref="missedEl"]')
                .contains('0');

            cy.get(competencySummaryCardId)
                .find('td[data-ref="averageEl"]')
                .contains('10');

            cy.get(competencySummaryCardId)
                .find('td[data-ref="growthEl"]')
                .contains('1.3 yr');

            // validate ELA.6 metrics
            var competencyCard = extQuerySelector('slate-demonstrations-student-competencycard{getCompetency().get("Code")=="ELA.6"}');
            var competencyCardId = '#' + competencyCard.id;

            // check baseline rating calculation
            cy.get(competencyCardId)
                .find('span[data-ref="codeEl"]')
                .contains('ELA.6');

            cy.get(competencyCardId)
                .find('td[data-ref="baselineRatingEl"]')
                .contains('9.5');

            cy.get(competencyCardId)
                .find('td[data-ref="averageEl"]')
                .contains('10');

            cy.get(competencyCardId)
                .find('td[data-ref="growthEl"]')
                .contains('1.5 yr');

            cy.get(competencyCardId)
                .find('div[data-ref="meterPercentEl"]')
                .contains('67%');
        });
    });
});