describe('CBL: Tasks Manager Test', () => {

    // load sample database before tests
    before(() => {
        // cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.intercept('GET', '/cbl/tasks?(\\?*)').as('tasksData');
        cy.intercept('POST', '/cbl/tasks/save?(\\?*)').as('taskSave');
        cy.intercept('POST', '/cbl/tasks/destroy?(\\?*)').as('taskDestroy');

        cy.loginAs('teacher');
    });

    it('Create public task as teacher', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/manager');

        // verify app loaded
        cy.extGet('slate-tasks-manager')
            .should('exist')
            .contains('.slate-apptitle', 'Task Library');

        // wait for data load
        cy.wait('@tasksData');

        // click create button
        cy.extGet('slate-tasks-manager-appheader button[action=create]')
            .click();

        // wait for window to transition open
        cy.extGet('slate-window')
            .should('not.have.class', 'x-hidden-clip')
            .within(() => {
                cy.root()
                    .contains('.x-title-text', 'Create Task');

                cy.root()
                    .contains('.x-form-item-label-text', 'Title');

                cy.root()
                    .get('.x-form-field[name="Title"]')
                    .click();

                cy.focused()
                    .should('have.attr', 'name', 'Title')
                    .type('Created Test Task Title');

                cy.get('.slate-panelfooter')
                    .contains('.x-btn-inner', 'Create')
                    .click();
            });

        // wait for data save
        cy.wait('@taskSave');
    });

    it('Edit public task as teacher', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/manager');

        // verify app loaded
        cy.extGet('slate-tasks-manager')
            .should('exist')
            .contains('.slate-apptitle', 'Task Library');

        // wait for data load
        cy.wait('@tasksData');

        // find and click created task
        cy.extGet('slate-tasks-manager')
            .contains('.x-grid-cell-inner', 'Created Test Task Title')
            .click();

        // click edit button
        cy.extGet('slate-tasks-manager-appheader button[action=edit]')
            .click();

        // wait for window to transition open
        cy.extGet('slate-window')
            .should('not.have.class', 'x-hidden-clip')
            .within(() => {
                cy.root()
                    .contains('.x-title-text', 'Edit Task');

                cy.root()
                    .contains('.x-form-item-label-text', 'Title');

                cy.root()
                    .get('.x-form-field[name="Title"]')
                    .click();

                cy.focused()
                    .should('have.attr', 'name', 'Title')
                    .type('Updated Test Task Title');

                cy.get('.slate-panelfooter')
                    .contains('.x-btn-inner', 'Save')
                    .click();
            });

        // wait for data save
        cy.wait('@taskSave');

        // verify selected record is updated
        cy.extGet('slate-tasks-manager-grid', { component: true })
            .should(grid => {
                const selection = grid.getSelection();
                expect(selection.length, 'one record selected').to.equal(1);

                const [ task ] = selection;
                expect(task.dirty, 'record is not dirty').to.be.false;
                expect(task.get('Title'), 'title is updated').to.equal('Updated Test Task Title');
            });
    });

    it('Delete public task as teacher', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/manager');

        // verify app loaded
        cy.extGet('slate-tasks-manager')
            .should('exist')
            .contains('.slate-apptitle', 'Task Library');

        // wait for data load
        cy.wait('@tasksData');

        // find and click updated task
        cy.extGet('slate-tasks-manager')
            .contains('.x-grid-cell-inner', 'Updated Test Task Title')
            .click();

        // click delete button
        cy.extGet('slate-tasks-manager-appheader button[action=delete]')
            .click();

        // get confirmation prompt
        cy.extGet('messagebox')
            .within(() => {
                cy.root()
                    .contains('.x-title-text', 'Delete Task');

                cy.root()
                    .contains('.x-window-text strong', 'Updated Test Task Title');

                cy.root()
                    .contains('.x-btn-inner', 'Yes')
                    .click();
            });

        // wait for data save
        cy.wait('@taskDestroy');

        // verify grid has no selection
        cy.extGet('slate-tasks-manager-grid', { component: true })
            .should(grid => {
                expect(grid.getSelection().length, 'no record selected').to.equal(0);
            });
    });

});