describe('Comptency dashboard ratings test', () => {

    // load sample database before tests
    before(() => {
        // cy.resetDatabase();
    });

     // authenticate as 'teacher' user
     beforeEach(() => {
        cy.loginAs('teacher');
    });

    it('XXXXXXXx', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/demonstrations/teacher');

        // verify teacher redirect
        cy.location('hash').should('eq', '#_')
        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
            .contains('Select a list of students and a content area to load progress dashboard')

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the 'Rubric' selector element
            const rubricSelector = extQuerySelector('slate-cbl-contentareaselector')

            // click the selector
            cy.get('#' + rubricSelector.el.dom.id).click();

            // verify and click first element of picker dropdown
            cy.get('#' + rubricSelector.getPicker().id + ' .x-boundlist-item')
            .contains('English Language Arts')
            .click()

            // verify hash updates
            cy.location('hash').should('eq', '#ELA')

            // get the 'Students' selector element
            const studentSelector = extQuerySelector('slate-cbl-studentslistselector')

            //click the selector
            cy.get('#' + studentSelector.el.dom.id)
                .click()
                .focused()
                .type('EXA')

            // verify and click first element of picker dropdown
            cy.get('#' + studentSelector.getPicker().id)
                .contains('Example School')
                .click()

            // verify hash updates
            cy.location('hash').should('eq', '#ELA/group:example_school');

            // verify content loads
            cy.get('.cbl-grid-competencies').contains('Reading Critically');

            // add descriptive data attribute
            cy.get('[data-ref=btnWrap]').click()

            cy.get('[name=StudentID]').type('Slate, Student')

            cy.get('[name=ExperienceType]').type('Studiooooooooooo', { force: true }) //input element may be hidden

            cy.get('[name=Context]').type('Test', { force: true }) //input element may be hidden

            cy.get('[name=PerformanceType]').type('Debate', { force: true }) //input element may be hidden

            cy.get('[name=ArtifactURL]').type('https://google.com', { force: true }) //input element may be hidden

            // add descriptive data attribute
            cy.get('.x-field x-form-item x-form-item-default x-form-type-text x-docked x-field-default').type('ELA.1')

        //     const competencyField = extQuerySelector('slate-cbl-competenciesgrid')
        //    // slate-cbl-ratings-studentcompetenciesfield-competenciestabs
        //    //slate-cbl-ratings-studentcompetenciesfield

        //     cy.get('#' + competencyField.el.dom.id)
        //         .click()
        //         .focused()
        //         .type('ELA.1')

















        })


    })



})