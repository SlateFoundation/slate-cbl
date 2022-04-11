describe('CBL: Teacher tasks test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.intercept('GET', '/cbl/tasks/*').as('taskData');
        cy.intercept('GET', '/cbl/student-tasks*').as('studentTasksData');
        cy.intercept('POST', '/cbl/tasks/save*').as('taskSave');
        cy.loginAs('teacher');
    });

    it('View single tasks as teacher', () => {

        // set up XHR monitors
        cy.intercept('GET', '/cbl/dashboards/tasks/teacher/bootstrap').as('getBootstrapData');
        cy.intercept('GET', '/sections?enrolled_user=*').as('getCurrentlyEnrolledSections');
        cy.intercept('GET', '/sections/*/cohorts').as('getSectionCohorts')
        cy.intercept('GET', '/section-participants*').as('getSectionParticipants')

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/teacher');
        cy.wait('@getBootstrapData')
        cy.get('@getBootstrapData.all').should('have.length', 1)

        // verify teacher redirect
        cy.location('hash').should('eq', '');

        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
            .contains('Select a section to load tasks dashboard');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the selector element
            var sectionSelector = extQuerySelector('slate-cbl-sectionselector');

            // click the selector
            cy.get('#' + sectionSelector.el.dom.id).click();

            cy.wait("@getCurrentlyEnrolledSections")
            cy.get('@getCurrentlyEnrolledSections.all').should('have.length', 1)
            // click ELA section element of picker dropdown
            cy.get('#' + sectionSelector.getPicker().id + ' .x-boundlist-item')
                .contains('English Language Arts')
                .click();

            cy.wait('@getSectionCohorts').its('response.statusCode').should('eq', 200)
            cy.get('@getSectionCohorts.all').should('have.length', 1)

            cy.wait('@getSectionParticipants').its('response.statusCode').should('eq', 200)
            cy.get('@getSectionParticipants.all').should('have.length', 1)

            // verify hash
            cy.location('hash').should('eq', '#ELA-001/all');

            // verify content loads
            var studentGrid = extQuerySelector('slate-studentsgrid');
            cy.get('#' + studentGrid.el.dom.id).contains('ELA Task One');
        });
    });

    it('Archive task as teacher', () => {
        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/teacher');

        // verify teacher redirect
        cy.location('hash').should('eq', '');

        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
            .contains('Select a section to load tasks dashboard');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the selector element
            var sectionSelector = extQuerySelector('slate-cbl-sectionselector');

            // click the selector
            cy.get('#' + sectionSelector.el.dom.id).click();

            // click ELA section element of picker dropdown
            cy.get('#' + sectionSelector.getPicker().id + ' .x-boundlist-item')
                .contains('English Language Arts')
                .click();

            // verify student tasks load
            cy.wait('@studentTasksData')
                .should(xhr => {
                    expect(xhr.status).to.equal(200);
                    expect(xhr.response.body.success).to.be.true;
                });

            // verify hash
            cy.location('hash').should('eq', '#ELA-001/all');

            // verify content loads
            var studentGrid = extQuerySelector('slate-studentsgrid');
            cy.get('#' + studentGrid.el.dom.id)
                .contains('ELA Task One')
                .contains('Edit')
                .click({ force: true });

            cy.wait('@taskData')
                .should(xhr => {
                    expect(xhr.status).to.equal(200);
                    expect(xhr.response.body.success).to.be.true;
                });

            cy.get('.slate-window')
                .contains('Archive Task')
                .click({ force: true });

            cy.wait('@taskSave')
                .should(xhr => {
                    expect(xhr.status).to.equal(200);
                    expect(xhr.response.body.success).to.be.true;
                });

            cy.get('#' + studentGrid.el.dom.id)
                .contains('ELA Task One (archived)');
        });
    });

    // requires Archive test to pass, or it will fail
    it('Un-Archive task as teacher', () => {
        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/teacher');

        // verify teacher redirect
        cy.location('hash').should('eq', '');

        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
            .contains('Select a section to load tasks dashboard');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the selector element
            var sectionSelector = extQuerySelector('slate-cbl-sectionselector');

            // click the selector
            cy.get('#' + sectionSelector.el.dom.id).click();

            // click ELA section element of picker dropdown
            cy.get('#' + sectionSelector.getPicker().id + ' .x-boundlist-item')
                .contains('English Language Arts')
                .click();

            // verify studetn tasks load
            cy.wait('@studentTasksData')
                .should(xhr => {
                    expect(xhr.status).to.equal(200);
                    expect(xhr.response.body.success).to.be.true;
                });

            // verify hash
            cy.location('hash').should('eq', '#ELA-001/all');

            var gridToolbar = extQuerySelector('slate-gridtoolbar');
            cy.get('#' + gridToolbar.el.dom.id)
                .contains('Show Archived Tasks')
                .click()

            cy.wait('@studentTasksData')
                .should(xhr => {
                    expect(xhr.status).to.equal(200);
                    expect(xhr.response.body.success).to.be.true;
                });

            // verify content loads
            var studentGrid = extQuerySelector('slate-studentsgrid');
            cy.get('#' + studentGrid.el.dom.id)
                .contains('ELA Task One (archived)')
                .contains('Edit')
                .click({ force: true });

            cy.wait('@taskData')
                .should(xhr => {
                    expect(xhr.status).to.equal(200);
                    expect(xhr.response.body.success).to.be.true;
                });

            cy.get('.slate-window')
                .contains('Un-Archive Task')
                .click({ force: true });

            cy.wait('@taskSave')
                .should(xhr => {
                    expect(xhr.status).to.equal(200);
                    expect(xhr.response.body.success).to.be.true;
                });

            cy.get('#' + studentGrid.el.dom.id)
                .contains('ELA Task One');
        });
    });
});