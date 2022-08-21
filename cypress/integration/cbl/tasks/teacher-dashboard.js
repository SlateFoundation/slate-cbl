describe('CBL / Tasks / Teacher Dashboard', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.intercept('GET', '/cbl/tasks/!(\\*)*?(\\?*)').as('taskData');
        cy.intercept('GET', '/cbl/student-tasks?(\\?*)').as('studentTasksData');
        cy.intercept('POST', '/cbl/tasks/save?(\\?*)').as('taskSave');
        cy.intercept('GET', '/cbl/dashboards/tasks/teacher/bootstrap').as('getBootstrapData');
        cy.intercept('GET', '/sections?(\\?*)').as('getSections');
        cy.intercept('GET', '/sections/*/cohorts').as('getSectionCohorts');
        cy.intercept('GET', '/section-participants?(\\?*)').as('getSectionParticipants');

        cy.loginAs('teacher');
    });

    it('Load selected grid', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/teacher');
        cy.wait('@getBootstrapData');
        cy.get('@getBootstrapData.all').should('have.length', 1);

        // verify teacher redirect
        cy.location('hash').should('eq', '');

        cy.extGet('slate-tasks-teacher-dashboard')
            .contains('.slate-placeholder', 'Select a section to load tasks dashboard');

        // click the 'Section' selector
        cy.extGet('slate-cbl-sectionselector')
            .click();

        cy.wait('@getSections');
        cy.get('@getSections.all').should('have.length', 1);

        // click ELA section element of picker dropdown
        cy.extGet('slate-cbl-sectionselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .contains('.x-boundlist-item', 'English Language Arts')
            .click();

        cy.wait('@getSectionCohorts').its('response.statusCode').should('eq', 200);
        cy.get('@getSectionCohorts.all').should('have.length', 1);

        cy.wait('@getSectionParticipants').its('response.statusCode').should('eq', 200);
        cy.get('@getSectionParticipants.all').should('have.length', 1);

        // verify hash
        cy.location('hash').should('eq', '#ELA-001/all');

        // verify student tasks load
        cy.wait('@studentTasksData').then(({ response }) => {
            expect(response.body.success).to.eq(true);
            expect(response.statusCode).to.eq(200);
        });
        cy.get('@studentTasksData.all').should('have.length', 1);

        // verify content loads
        cy.extGet('slate-studentsgrid')
            .contains('.jarvus-aggregrid-header-text', 'ELA Task One');
    });

    it('View student task', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/teacher#ELA-001/all');

        // wait for data to load
        cy.wait('@getBootstrapData');
        cy.get('@getBootstrapData.all').should('have.length', 1);

        // verify student tasks load
        cy.wait('@studentTasksData').then(({ response }) => {
            expect(response.body.success).to.eq(true);
            expect(response.statusCode).to.eq(200);
        });
        cy.get('@studentTasksData.all').should('have.length', 1);

        // find and click the first grid cell
        cy.extGet('slate-studentsgrid')
            .should('exist')
            .find('.slate-studentsgrid-cell')
            .first()
            .click();

        // ensure the first skill rating field has class 'cbl-level-9'
        cy.get('.slate-cbl-skillratingsfield .slate-cbl-ratings-slider')
            .first()
            .should('have.have.class', 'cbl-level-9');
    });

    it('Archive task as teacher', () => {

        // set up XHR monitors
        cy.intercept('GET', '/cbl/skills?(\\?*)').as('getSkills');

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/teacher#ELA-001/all');

        // wait for data to load
        cy.wait('@getBootstrapData');
        cy.get('@getBootstrapData.all').should('have.length', 1);

        // verify student tasks load
        cy.wait('@studentTasksData').then(({ response }) => {
            expect(response.body.success).to.eq(true);
            expect(response.statusCode).to.eq(200);
        });
        cy.get('@studentTasksData.all').should('have.length', 1);

        // verify content loads and click edit
        cy.extGet('slate-studentsgrid')
            .contains('.jarvus-aggregrid-header-text', 'ELA Task One')
            .contains('button', 'Edit')
            .click({ force: true });

        // wait for modal data to load
        cy.wait('@taskData').then(({ response }) => {
            expect(response.body.success).to.eq(true);
            expect(response.statusCode).to.eq(200);
        });

        // wait for window to transition open
        cy.extGet('slate-window')
            .should('not.have.class', 'x-hidden-clip')
            .contains('.x-btn-inner', 'Archive Task')
            .click();

        cy.wait('@taskSave').then(({ response }) => {
            expect(response.body.success).to.eq(true);
            expect(response.statusCode).to.eq(200);
        });

        cy.extGet('slate-studentsgrid')
            .find('.jarvus-aggregrid-rowheader .jarvus-aggregrid-header-text')
            .should($rowHeaders => {
                const archived = $rowHeaders.filter(':contains(ELA Task One \(archived\))');
                expect(archived.length, 'one archived task').to.eq(1);

                const taskOne = $rowHeaders.filter(':contains(ELA Task One)');
                expect(taskOne.length, 'only one "ELA Task One"').to.eq(1);
            });
    });

    // requires Archive test to pass, or it will fail
    it('Un-Archive task as teacher', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/teacher#ELA-001/all');

        // wait for data to load
        cy.wait('@getBootstrapData');
        cy.get('@getBootstrapData.all').should('have.length', 1);

        // verify student tasks load
        cy.wait('@studentTasksData').then(({ response }) => {
            expect(response.body.success).to.eq(true);
            expect(response.statusCode).to.eq(200);
        });
        cy.get('@studentTasksData.all').should('have.length', 1);

        // enable showing archived tasks
        cy.extGet('slate-gridtoolbar')
            .contains('.x-form-item-label-text', 'Show Archived Tasks')
            .click();

        // verify student tasks load
        cy.wait('@studentTasksData').then(({ response }) => {
            expect(response.body.success).to.eq(true)
            expect(response.statusCode).to.eq(200)
        });

        // verify content loads
        cy.extGet('slate-studentsgrid')
            .contains('.jarvus-aggregrid-header-text', 'ELA Task One (archived)')
            .contains('button', 'Edit')
            .click({ force: true });

        cy.wait('@taskData').then(({ response }) => {
            expect(response.body.success).to.eq(true)
            expect(response.statusCode).to.eq(200)
        })

        cy.extGet('slate-window')
            .should('not.have.class', 'x-hidden-clip')
            .contains('.x-btn-inner', 'Un-Archive Task')
            .click();

        cy.wait('@taskSave').then(({ response }) => {
            expect(response.body.success).to.eq(true)
            expect(response.statusCode).to.eq(200)
        })

        // verify content loads
        cy.extGet('slate-studentsgrid')
            .find('.jarvus-aggregrid-rowheader .jarvus-aggregrid-header-text')
            .should($rowHeaders => {
                const archived = $rowHeaders.filter(':contains(ELA Task One \(archived\))');
                expect(archived.length, 'one archived task').to.eq(0);

                const taskOne = $rowHeaders.filter(':contains(ELA Task One)');
                expect(taskOne.length, 'only one "ELA Task One"').to.eq(1);
            });
    });
});