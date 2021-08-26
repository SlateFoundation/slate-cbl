describe('Student competency growth calculation test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
        cy.server().route('GET', '/cbl/student-competencies*').as('studentCompetencyData');
    });

    const compareCompetencyValues = (code, competencyCardId, {baseline, growth, average}) => {
        // check baseline rating calculation
        cy.get(`#${competencyCardId}`)
            .find('span[data-ref="codeEl"]')
            .contains(code);

        cy.get(`#${competencyCardId}`)
            .find('td[data-ref="baselineRatingEl"]')
            .contains(baseline === null ? '—' : baseline);

        cy.get(`#${competencyCardId}`)
            .find('td[data-ref="averageEl"]')
            .contains(average === null ? '—' : average);

        cy.get(`#${competencyCardId}`)
            .find('td[data-ref="growthEl"]')
            .contains(growth === null ? '—' : `${growth} yr`);

    };

    const checkCompetencyCalculation = ({student, contentArea, competency, baseline, growth, average}) => {
        cy.visit(`/cbl/dashboards/demonstrations/student#${student}/${contentArea}`);
        // ensure that API has loaded required data
        cy.wait('@studentCompetencyData')
            .its('status')
            .should('eq', 200)
            .then(() => {
                // ensure competency card elements have rendered
                cy.get('li.slate-demonstrations-student-competencycard')
                    .then(() => {
                        cy.withExt().then(({extQuerySelector}) => {
                            const card = extQuerySelector(`slate-demonstrations-student-competencycard{getCompetency().get("Code")=="${contentArea}.${competency}"}`);

                            compareCompetencyValues(`${contentArea}.${competency}`, card.id, {
                                baseline,
                                growth,
                                average
                            });
                        });
                    });
            });
    };

    it('Student ELA.1', () => {
        checkCompetencyCalculation({
            student: 'student',
            contentArea: 'ELA',
            competency: 1,
            baseline: 10,
            growth: -1.5,
            average: 9.3
        });
    });

    it('Student ELA.2,', () => {
        checkCompetencyCalculation({
            student: 'student',
            contentArea: 'ELA',
            competency: 2,
            baseline: 10,
            average: 10.8,
            growth: 1,
        });
    });

    it('Student ELA.3,', () => {
        checkCompetencyCalculation({
            student: 'student',
            contentArea: 'ELA',
            competency: 6,
            baseline: 9.5,
            average: 10,
            growth: 1.5,
        });
    });

    it('Student3 ELA.1,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'ELA',
            competency: 1,
            baseline: 7.3,
            average: 7.3,
            growth: 0,
        });
    });

    it('Student3 ELA.2,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'ELA',
            competency: 2,
            baseline: null,
            average: 7.3,
            growth: null,
        });
    });

    it('Student3 ELA.3,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'ELA',
            competency: 3,
            baseline: 5.5,
            average: 8,
            growth: 2.5,
        });
    });

    it('Student3 ELA.4,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'ELA',
            competency: 4,
            baseline: 5.7,
            average: 6.5,
            growth: 0.8,
        });
    });

    it('Student3 ELA.5,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'ELA',
            competency: 5,
            baseline: null,
            average: 7.4,
            growth: null,
        });
    });

    it('Student3 ELA.6,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'ELA',
            competency: 6,
            baseline: null,
            average: 8,
            growth: null,
        });
    });

    it('Student3 ELA.7,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'ELA',
            competency: 7,
            baseline: 7,
            average: 7.4,
            growth: 0.7,
        });
    });

    it('Student3 SS.1,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'SS',
            competency: 1,
            baseline: 9.4,
            average: 9,
            growth: -0.4,
        });
    });

    it('Student3 SS.2,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'SS',
            competency: 2,
            baseline: null,
            average: 8,
            growth: null,
        });
    });

    it('Student3 SCI.1,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'SCI',
            competency: 1,
            baseline: 9.1,
            average: 9.4,
            growth: 0.4,
        });
    });

    it('Student3 SCI.2,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'SCI',
            competency: 2,
            baseline: 9.3,
            average: 8,
            growth: -1.3,
        });
    });

    it('Student3 SCI.3,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'SCI',
            competency: 3,
            baseline: 9.7,
            average: 7,
            growth: null,
        });
    });

    it('Student3 SCI.4,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'SCI',
            competency: 4,
            baseline: 9.7,
            average: 10,
            growth: 0.3,
        });
    });

    it('Student3 HOS.4,', () => {
        checkCompetencyCalculation({
            student: 'student3',
            contentArea: 'HOS',
            competency: 4,
            baseline: 9,
            average: 9.3,
            growth: null,
        });
    });


    // Should fail until new backend/fixture data is merged
    it.skip('One rating for each skill', () => {
        checkCompetencyCalculation({
            student: 'student4',
            contentArea: 'ELA',
            competency: 1,
            baseline: 6,
            growth: 0
        });
    });

});