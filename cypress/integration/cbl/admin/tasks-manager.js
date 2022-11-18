describe('CBL / Admin / Tasks Manager', () => {

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

    it('Verify buttons disabled when no selection', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/manager');

        // verify app loaded
        cy.extGet('slate-tasks-manager')
            .should('exist')
            .contains('.slate-apptitle', 'Task Library');

        // wait for data load
        cy.wait('@tasksData');

        // verify create button not disabled
        cy.extGet('slate-tasks-manager-appheader button[action=create]')
            .should('exist')
            .should('not.have.class', 'x-btn-disabled')

        // verify edit button disabled
        cy.extGet('slate-tasks-manager-appheader button[action=edit]')
            .should('exist')
            .should('have.class', 'x-btn-disabled')

        // verify delete button disabled
        cy.extGet('slate-tasks-manager-appheader button[action=delete]')
            .should('exist')
            .should('have.class', 'x-btn-disabled')

        // select the first grid cell
        cy.root()
            .get('.x-grid-cell-inner')
            .first()
            .click();

        // verify edit button not disabled after selection
        cy.extGet('slate-tasks-manager-appheader button[action=edit]')
            .should('exist')
            .should('not.have.class', 'x-btn-disabled')

        // verify delete button not disabled after selection
        cy.extGet('slate-tasks-manager-appheader button[action=delete]')
            .should('exist')
            .should('not.have.class', 'x-btn-disabled')
    });

    it('Verify grid filtering for shared and unshared tasks', () => {

        // verify that shared task is present
        cy.extGet('slate-tasks-manager')
            .should('exist')
            .contains('.x-grid-cell-inner', 'A Shared Task')
            .should('exist');

        // verify that the unshared task is not present
        cy.extGet('slate-tasks-manager')
            .should('exist')
            .contains('.x-grid-cell-inner', 'An Unshared Task')
            .should('not.exist');

        // open options menu
        cy.extGet('slate-tasks-manager-grid button[action=settings]')
            .should('exist')
            .click();

        // check 'include unshared' option
        cy.extGet('slate-tasks-manager-grid menucheckitem[name=include-unshared]')
            .should('exist')
            .click();

        // wait for data load after option change
        cy.wait('@tasksData');

        // verify that shared task is present
        cy.extGet('slate-tasks-manager')
            .should('exist')
            .contains('.x-grid-cell-inner', 'A Shared Task')
            .should('exist');

        // verify that the unshared task is present
        cy.extGet('slate-tasks-manager')
            .should('exist')
            .contains('.x-grid-cell-inner', 'An Unshared Task')
            .should('exist');
    });

    it('Verify shared/unshared filtering in clone field', () => {

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

                // click cloned task selector
                cy.extGet('slate-cbl-taskselector[name=ClonedTaskID]')
                    .should('exist')
                    .within(() => {

                        cy.root()
                            .get('.x-form-arrow-trigger')
                            .click()

                    });

                // wait for options to load
                cy.wait('@tasksData');

                // verify shared task exists in picker dropdown
                cy.extGet('slate-cbl-taskselector[name=ClonedTaskID]', { component: true })
                    .then(selector => selector.getPicker().el.dom)
                    .contains('.x-boundlist-item', 'A Shared Task')
                    .should('exist');

                // verify unshared task does not exist in picker dropdown
                cy.extGet('slate-cbl-taskselector[name=ClonedTaskID]', { component: true })
                    .then(selector => selector.getPicker().el.dom)
                    .contains('.x-boundlist-item', 'An UnShared Task')
                    .should('not.exist');
            });
    });

    it('Verify sorting by column', () => {
        var items;

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/manager');

        // verify app loaded
        cy.extGet('slate-tasks-manager')
            .should('exist')
            .contains('.slate-apptitle', 'Task Library');

        // wait for data load
        cy.wait('@tasksData');

        cy.extGet('slate-tasks-manager')
            .should('not.have.class', 'is-loading');


        /** Title column */
        // click title column header to sort alphabetically
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Title')
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify the sort order icon in column header
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Title')
            .should('have.class', 'x-column-header-sort-ASC')

        // verify column is sorted in alphabetical order
        items = _getColumnValues(0);
        cy.expect(items, 'Title column: items are sorted in alphbetical order.').to.deep.equal(items.slice().sort());

        // click title column header to reverse sort
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Title')
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify the sort order icon in column header
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Title')
            .should('have.class', 'x-column-header-sort-DESC')

        // verify column is sorted in reverse alphabetical order
        items = _getColumnValues(0);
        cy.expect(items, 'Title column: items are sorted in reverse alphbetical order.').to.deep.equal(items.slice().sort().reverse());


        /** Parent Task column */
        // click Parent Task column header to sort alphabetically
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Subtask of')
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify column is sorted in alphabetical order
        items = _getColumnValues(1);
        cy.expect(items, 'Parent Task column: items are sorted in alphbetical order.').to.deep.equal(items.slice().sort());

        // click Parent Task column header to reverse sort
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Subtask of')
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify column is sorted in reverse alphabetical order
        items = _getColumnValues(1);
        cy.expect(items, 'Parent Task column: items are sorted in reverse alphbetical order.').to.deep.equal(items.slice().sort().reverse());


        /** Experience Type column */
        // click Experience Type column header to sort alphabetically
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Type of Exp.')
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify column is sorted in alphabetical order
        items = _getColumnValues(2);
        cy.expect(items, 'Experience Type column: items are sorted in alphbetical order.').to.deep.equal(items.slice().sort());

        // click Experience Type column header to reverse sort
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Type of Exp.')
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify column is sorted in reverse alphabetical order
        items = _getColumnValues(2);
        cy.expect(items, 'Experience Type column: items are sorted in reverse alphbetical order.').to.deep.equal(items.slice().sort().reverse());


        /** Skills column */
        // click Skills column header to sort alphabetically
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Skills')
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify column is sorted in alphabetical order
        items = _getColumnValues(3);
        cy.expect(items, 'Skills column: items are sorted in alphbetical order.').to.deep.equal(items.slice().sort());

        // click Skills column header to reverse sort
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Skills')
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify column is sorted in reverse alphabetical order
        items = _getColumnValues(3);
        cy.expect(items, 'Skills column: items are sorted in reverse alphbetical order.').to.deep.equal(items.slice().sort().reverse());


        /** Creator column */
        // click Creator column header to sort alphabetically
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Created by')
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify column is sorted in alphabetical order
        items = _getColumnValues(4);
        cy.expect(items, 'Creator column: items are sorted in alphbetical order.').to.deep.equal(items.slice().sort());

        // click Creator column header to reverse sort
        cy.get('.x-grid-header-ct', { log: false })
            .contains('.x-column-header', 'Created by')
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify column is sorted in reverse alphabetical order
        items = _getColumnValues(4);
        cy.expect(items, 'Creator column: items are sorted in reverse alphbetical order.').to.deep.equal(items.slice().sort().reverse());


        /** Creation Date column */
        // click Creation Date column header to sort alphabetically (access by index rather than text)
        cy.get('.x-grid-header-ct', { log: false })
            .find('.x-column-header .x-column-header-text', { log: false })
            .eq(5, { log: false })
            .then(($div) => {
                expect($div).to.have.text('Created')
            })
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify column is sorted in alphabetical order
        items = _getColumnValues(5);
        cy.expect(items, 'Creation Date column: items are sorted in alphbetical order.').to.deep.equal(items.slice().sort());

        // click Creation Date column header to reverse sort
        cy.get('.x-grid-header-ct', { log: false })
            .find('.x-column-header .x-column-header-text', { log: false })
            .eq(5, { log: false })
            .then(($div) => {
                expect($div).to.have.text('Created')
            })
            .click();

        // wait for data load
        cy.wait('@tasksData');

        // verify column is sorted in reverse alphabetical order
        items = _getColumnValues(5);
        cy.expect(items, 'Creation Date column: items are sorted in reverse alphbetical order.').to.deep.equal(items.slice().sort().reverse());

    });

    function _getColumnValues(col) {
        let items = [];
        cy.get('.x-grid-row', { log: false })
            .each(($row) => {
                cy.wrap($row, { log: false })
                    .find('.x-grid-cell-inner', { log: false })
                    .eq(col, { log: false })
                    .should(($div) => {
                        items.push($div.text().trim());
                    })
            })
        return items;
    };
});