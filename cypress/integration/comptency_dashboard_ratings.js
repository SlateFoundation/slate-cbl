describe('Comptency dashboard ratings test', () => {

    // load sample database before tests
    before(() => {
        // cy.resetDatabase();
    });

     // authenticate as 'teacher' user
     beforeEach(() => {
        cy.loginAs('teacher');
    });

    it('Checking Dashboard Ratings', () => {

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
            cy.wait(6000)

            // confirm correct page has loaded
            cy.get('.cbl-grid-competencies').contains('Reading Critically');

            // click buttton to open modal
            cy.get('[data-ref=btnWrap]').click()

            // enter a students name
            cy.get('[name=StudentID]').type('Cross, Clarisa')

            // enter an experience type
            cy.get('[name=ExperienceType]').type('Studio', { force: true }) //input element may be hidden

            cy.get('[name=Context]').type('Test', { force: true }) //input element may be hidden

            // enter performance type
            cy.get('[name=PerformanceType]').type('Debate', { force: true }) //input element may be hidden

            // enter a url address
            cy.get('[name=ArtifactURL]').type('https://google.com', { force: true }) //input element may be hidden

            //click English Language Arts course
            cy.get('#gridview-1038-record-391').click()

            //get modal and check if ELA.1 is showing to click
            cy.get('#slate-window-1028-body').contains('ELA.1').click()

            //check that ELA.1 is showing Reading Critically competencies
            cy.get("#slate-cbl-ratings-studentcompetenciesfield-1031-bodyEl").contains('Reading Critically')

            //select a competency score on the slider
            cy.get('#slate-cbl-ratings-slider-1059-thumb-3').click({force: true})

            //select a competency score on the slider
            cy.get('#slate-cbl-ratings-slider-1061-thumb-9').click({force: true})

            //add competency
            cy.get('#tab-1039').click()

            //get modal and check if ELA.2 is showing to click
            cy.get('#slate-window-1028-body').contains('ELA.2').click()

            //check that ELA.2 is showing Expressing Ideas competencies
            cy.get("#slate-cbl-ratings-studentcompetenciesfield-1031-bodyEl").contains('Expressing Ideas')

            //select a competency score on the slider
            cy.get("#slate-cbl-ratings-slider-1068-thumb-2").click({force: true})

            //select a competency score on the slider
            cy.get("#slate-cbl-ratings-slider-1069-thumb-5").click({force: true})

            //select a competency score on the slider
            cy.get("#slate-cbl-ratings-slider-1070-thumb-7").click({force: true})

            //add competency
            cy.get('#tab-1039').click()

            //unselect English Language Arts course that was selected
            cy.get('#slate-cbl-competenciesgrid-1034-bodyWrap').contains('English Language Arts').click()

            //click Habits of Success course
            cy.get('#gridview-1038-record-445').click()

            //get modal and check if HOS.1 is showing to click
            cy.get('#slate-window-1028-body').contains('HOS.1').click()

            //check that HOS.1 is showing Personal Work Habits competencies
            cy.get("#slate-cbl-ratings-studentcompetenciesfield-1031-bodyEl").contains('Personal Work Habits')

            //select a competency score on the slider
            cy.get("#slate-cbl-ratings-slider-1077-thumb-1").click({force: true})

            //select a competency score on the slider
            cy.get("#slate-cbl-ratings-slider-1078-thumb-3").click({force: true})

            //select a competency score on the slider
            cy.get("#slate-cbl-ratings-slider-1079-thumb-5").click({force: true})

            //type comment into text area
            cy.get('#textarea-1040-inputEl').type('test test test')

            // click save demonstration button
            cy.get('#button-1042').click({force: true})

            // todo: check modal that appears with name and demonstration total selected and then disappears

            // get percentage of compentencies selected on the Reading Critically column and click
            cy.get('#ext-element-12').contains('33%').click()

            // check the slider score for the 'Choose and apply reading strategies' competency
            cy.get('#ext-element-528').contains('11')

            // check the slider score for the  'Evaluate the main ideas or themes' competency
            cy.get('#ext-element-599').contains('12')

            // check the slider score for the 'Analyze context, point of view, and purpose; competency
            cy.get('#ext-element-670').contains('10')

            // check the slider score for the 'Analyze craft' competency
            cy.get('#ext-element-741').contains('9')

            // check the average score of the four comptency scores chosen (11 + 12 + 10 + 9 / 4) === 10.5
            cy.get('#ext-element-19').contains('10.5')

            // get the percentage of compentencies selected on the Habits of Success column and click
            cy.get('#ext-element-91').contains('13%').click()

            // check the slider score for the 'Identify a core message and audience' competency
            cy.get('#ext-element-817').contains('10')

            // check the slider score for the 'Develop and organize the message' competency
            cy.get('#ext-element-880').contains('12')

            // check the average score of the two comptency scores chosen (10 + 12 / 2) === 11
        })
    })
})