describe('Tasks Manager Test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.server().route('GET', '/cbl/tasks').as('taskData');
        cy.server().route('POST', '/cbl/tasks/save*').as('taskSave');

        cy.loginAs('teacher');
    });

    it('Create public task as teacher', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/manager');

        // verify teacher redirect
        cy.location('hash').should('eq', '');

        cy.get('#slateapp-viewport')
            .contains('Task Library');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the selector element
            var taskManager = extQuerySelector('slate-tasks-manager'),
                appHeader = taskManager.down('slate-tasks-manager-appheader'),
                createBtn = appHeader.down('button[action=create]');
                // editBtn = appHeader.down('button[action=edit]'),
                // deleteBtn = appHeader.down('button[action=delete]');


            // click create button
            cy.get('#' + createBtn.getId())
                .click({ force: true });

            cy.get('.slate-window')
                .contains('Create Task');

            cy.get('.slate-window')
                .contains('Title')
                .click({ force: true })

            cy.focused()
                .should('have.attr', 'name', 'Title')
                .type('Test Task Title');

            cy.get('.slate-window .slate-panelfooter')
                .contains('Create')
                .click({ force: true });
        });
    });

    it('Edit public task as teacher', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/manager');

        // verify teacher redirect
        cy.location('hash').should('eq', '');

        cy.get('#slateapp-viewport')
            .contains('Task Library');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the selector element
            var taskManager = extQuerySelector('slate-tasks-manager'),
                appHeader = taskManager.down('slate-tasks-manager-appheader'),
                editBtn = appHeader.down('button[action=edit]');
                // deleteBtn = appHeader.down('button[action=delete]');


            cy.contains('Test Task Title')
                .click({ force: true });

            // click create button
            cy.get('#' + editBtn.getId())
                .click({ force: true });

            cy.get('.slate-window')
                .contains('Edit Task');

            cy.get('.slate-window')
                .contains('Title')
                .click({ force: true })

            cy.focused()
                .should('have.attr', 'name', 'Title')
                .type('Test Task Title - Updated');

            cy.get('.slate-window .slate-panelfooter')
                .contains('Save')
                .click({ force: true });
        });
    });

    it('Delete public task as teacher', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/manager');

        // verify teacher redirect
        cy.location('hash').should('eq', '');

        cy.get('#slateapp-viewport')
            .contains('Task Library');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get the selector element
            var taskManager = extQuerySelector('slate-tasks-manager'),
                appHeader = taskManager.down('slate-tasks-manager-appheader'),
                deleteBtn = appHeader.down('button[action=delete]');


            cy.contains('Test Task Title')
                .click({ force: true });

            // click create button
            cy.get('#' + deleteBtn.getId())
                .click({ force: true });

            cy.get('.x-window')
                .contains('Delete Task');

            cy.get('.x-window .x-docked')
                .contains('Yes')
                .click({ force: true });
        });
    });

});