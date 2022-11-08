const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
const today = dayjs();

// todo: confirm this is still needed
dayjs.extend(isBetween);


// load sample database before tests
before(() => {

    // create some relatively due tasks
    _loadTaskData([{
            Title: 'Test Task (Due Today)',
            DueDate: today.format('MM/DD/YYYY'),
        }, {
            Title: 'Test Task (Due This Week)',
            DueDate: today.add(5, 'day').format('MM/DD/YYYY'),
        }, {
            Title: 'Test Task (Due Recently)',
            DueDate: today.subtract(9, 'day').format('MM/DD/YYYY'),
        }, {
            Title: 'Test Task (Due Next Week)',
            DueDate: today.add(8, 'day').format('MM/DD/YYYY'),
        }, {
            Title: 'Test Task (No Due Date)',
        }]);

    // create an archived task
    cy.request('POST', `/cbl/tasks/save?format=json`, {
        data: [{
            Title: 'Test Task (Archived)',
            SectionID: 2,
            Status: 'archived',
            Assignees: {
                'student': true
            }
        }]
    });
});

beforeEach(() => {
    cy.intercept('GET', '/cbl/dashboards/tasks/student/bootstrap?(\\?*)').as('bootstrapData');
    cy.intercept('GET', '/cbl/skills?(\\?*)').as('skillsData');
    cy.intercept('GET', '/cbl/competencies?(\\?*)').as('competenciesData');
    cy.intercept('GET', '/cbl/student-tasks?(\\?*)').as('studentTasksData');
    cy.intercept('GET', '/cbl/todos/\\*groups?(\\?*)').as('studentTodosData');
    cy.intercept('POST', '/cbl/student-tasks/save?(\\?*)').as('studentTasksSave');
});

function _loadTaskData(taskData) {
    cy.resetDatabase();

    cy.intercept('GET', '/cbl/student-tasks?(\\?*)').as('studentTasksData');
    cy.intercept('POST', '/cbl/tasks/save?(\\?*)').as('taskSave');

    // create time relative tasks
    cy.loginAs('teacher');

    // open student demonstrations dashboard
    cy.visit('/cbl/dashboards/tasks/teacher#ELA-001/all');

    // wait for data load
    cy.wait('@studentTasksData');

    for (var i = 0; i < taskData.length; i++) {

        let task = taskData[i];

        // click create button
        cy.extGet('slate-tasks-teacher-dashboard button[action=create]')
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
                    .type(task['Title']);

                if (task['DueDate']) {
                    cy.root()
                        .get('.x-form-field[name="DueDate"]')
                        .click();

                    cy.focused()
                        .should('have.attr', 'name', 'DueDate')
                        .type(task['DueDate']);
                }

                cy.extGet('slate-cbl-assigneesfield')
                    .find('.x-form-arrow-trigger')
                    .click({ force: true}) // force click if element isn't visible

                cy.extGet('slate-cbl-assigneesfield', { component: true })
                    .then(selector => selector.getPicker().el.dom)
                    .contains('.x-boundlist-item', 'Student Slate')
                    .click({ force: true});

                cy.root()
                    .get('.x-form-field[name="Instructions"]')
                    .click();

                cy.extGet('button[action=submit]')
                    .click();

                // wait for data save
                cy.wait('@taskSave');

            });
    }
}

function _visitDashboardAsStudent(student = 'student') {
    cy.loginAs(`${student}`);
    cy.visit(`/cbl/dashboards/tasks/student`);

    cy.wait('@studentTasksData')
        .its('response.statusCode')
        .should('eq', 200);
}

function _visitDashboardAsTeacher({ teacher = 'teacher', student = 'student' } = {}) {
    cy.loginAs(`${teacher}`);
    cy.visit(`/cbl/dashboards/tasks/student#${student}/all`);

    cy.wait('@studentTasksData')
        .its('response.statusCode')
        .should('eq', 200);
}

function _selectFilter(filterText, tasksSelector) {
    cy.extGet('slate-tasks-student-taskfiltersmenu')
        .contains('.x-menu-item-text', filterText)
        .click({ force: true}) // force click if element isn't visible

    // wait for XHR response
    cy.wait('@studentTasksData')
        .its('response.statusCode')
        .should('eq', 200);

    // wait for filter to be effective
    cy.extGet('slate-tasks-student-tasktree')
        .should('not.have.class', 'is-loading')
        .find('.slate-tasktree-item')
        .should($tasks => {
            if (tasksSelector) {
                const $includedTasks = $tasks.filter(tasksSelector);
                const $excludedTasks = $tasks.filter(`:not(${tasksSelector})`);
                expect($includedTasks.length, 'some included items present').to.be.gt(0);
                expect($excludedTasks.length, 'no excluded items present').to.equal(0);
            }
        });
}

function _deselectAllFilters() {
    cy.extGet('slate-tasks-student-taskfiltersmenu menucheckitem[checked]', { component: true, all: true })
        .each(item => item.setChecked(false))

    cy.wait('@studentTasksData')
        .its('response.statusCode')
        .should('eq', 200);
}

function _clickFilterButton() {
    cy.extGet('slate-tasks-student-tasktree')
        .contains('.x-btn-inner', 'Filter')
        .click({ force: true });
};


describe('CBL / Tasks / Student Dashboard: Workflows', () => {

    it('Submit task as student / Re-Assign As Teacher', () => {
        // todo: create task in test? we want to make sure tests don't fail because of previous test failures or successes
        let studentUsername = 'student',
            teacherUsername = 'teacher';

        cy.loginAs(teacherUsername);
        cy.request('POST', `/cbl/tasks/save?format=json`, {
            data: [{
                Title: 'Test Task (Revision Workflow)',
                DueDate: today.format('YYYY-MM--DD'),
                SectionID: 2,
                Assignees: {
                    'student': true
                }
            }]
        });

        _visitDashboardAsStudent(studentUsername);
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Due Tasks', '.slate-tasktree-status-due, .slate-tasktree-status-late');

        cy.extGet('slate-tasks-student-tasktree')
            .contains('.slate-tasktree-title', 'Revision Workflow')
            .click({ force: true });

        cy.wait(['@skillsData', '@competenciesData'])
            .should(intercepts => {
                for (const { response } of intercepts) {
                    expect(response.statusCode).to.equal(200);
                    expect(response.body.success).to.be.true;
                }
            });

        cy.extGet('slate-window')
            .contains('.x-btn-inner', 'Submit Assignment')
            .should((btn) => {
                expect(btn).to.be.visible;
                expect(btn.attr('aria-disabled')).to.not.be.true;
            })
            .click();

        cy.wait('@studentTasksSave')
            .should(({ response }) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.be.true;
            });

        cy.extGet('slate-tasks-student-tasktree')
            .contains('Submitted');


        // re-assign as teacher
        _visitDashboardAsTeacher({
            student: studentUsername,
            teacher: teacherUsername,
        });

        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Submitted', '.slate-tasktree-status-due.needsrated');

        cy.extGet('slate-tasks-student-tasktree')
            .contains('.slate-tasktree-title', 'Revision Workflow')
            .click();

        cy.wait('@studentTasksData')
            .its('response.statusCode')
            .should('eq', 200);

        cy.extGet('slate-window')
            .contains('.x-form-cb-label', 'Re-assign')
            .click();

        cy.extGet('slate-window')
            .contains('.x-btn-inner', 'Save Assignment')
            .should((btn) => {
                expect(btn).to.be.visible;
                expect(btn.attr('aria-disabled')).to.not.be.true;
            })
            .click();

        cy.wait('@studentTasksSave')
            .should(({ response }) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.be.true;
            });

        cy.extGet('slate-tasks-student-tasktree')
            .contains('.slate-tasktree-status', 'Revision')
            .should('exist');
    });

    it('Submitted Tasks Filter', () => {
        // create the task as teacher and assign to student
        _visitDashboardAsTeacher();
        cy.request('POST', `/cbl/tasks/save?format=json&include=StudentTasks`, {
            data: [{
                Title: 'Test Task (Submitted)',
                DueDate: today.format('YYYY-MM--DD'),
                SectionID: 2,
                Assignees: {
                    student: true
                }
            }]
        }).then(response => {
            expect(response.body.data).to.be.an('array').and.to.have.length(1);
            expect(response.body.data[0].StudentTasks).to.be.an('array').and.to.have.length(1);
            const studentTaskId = response.body.data[0].StudentTasks[0].ID;

            // login as student, and submit
            _visitDashboardAsStudent();
            _clickFilterButton();
            _deselectAllFilters();
            _selectFilter('Due Tasks', '.slate-tasktree-status-due, .slate-tasktree-status-late');

            // close filter menu to prevent interference with opening task
            _clickFilterButton();

            // open recently created task
            cy.extGet('slate-tasks-student-tasktree')
                .find(`.slate-tasktree-item[data-id=${studentTaskId}]`)
                .should('have.length', 1)
                .click();

            cy.wait(['@skillsData', '@competenciesData'])
                .should(intercepts => {
                    for (const { response } of intercepts) {
                        expect(response.statusCode).to.equal(200);
                        expect(response.body.success).to.be.true;
                    }
                });

            // submit task as student
            cy.extGet('slate-window')
                .contains('.x-btn-inner', 'Submit Assignment')
                .should((btn) => {
                    expect(btn).to.be.visible;
                    expect(btn.attr('aria-disabled')).to.not.be.true;
                })
                .click();

            cy.wait('@studentTasksSave')
                .should(({ response }) => {
                    expect(response.statusCode).to.equal(200);
                    expect(response.body.success).to.be.true;
                    expect(response.body.data).to.be.an('array').and.to.have.length(1);
                    expect(response.body.data[0].ID).to.equal(studentTaskId);
                });

            // verify status shows as submitted to student
            cy.extGet('slate-tasks-student-tasktree')
                .find(`.slate-tasktree-item[data-id=${studentTaskId}]`)
                .should('have.length', 1)
                .should('have.class', 'needsrated')
                .contains('.slate-tasktree-status', 'Submitted');

            // switch to teacher view
            _visitDashboardAsTeacher();
            _clickFilterButton();
            _deselectAllFilters();
            _selectFilter('Submitted', '.slate-tasktree-status-due.needsrated');

            // verify status shows as submitted to student
            cy.extGet('slate-tasks-student-tasktree')
                .find(`.slate-tasktree-item[data-id=${studentTaskId}]`)
                .should('have.length', 1)
                .should('have.class', 'needsrated')
                .contains('.slate-tasktree-status', 'Submitted');
        });
    });
});


describe('CBL / Tasks / Student Dashboard: Section Filters', () => {

    // todo: ensure we create data that should NOT included in filter
    it('Enrolled Sections Filter', () => {
        let studentUsername = 'student';
        _visitDashboardAsTeacher({ student: studentUsername });
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Enrolled Sections');

        // get the users sections ids from the current term via the API
        cy.request(`/sections?enrolled_user=${studentUsername}&format=json`)
            .then(response => {
                const { data: sections } = response.body;
                const sectionIds = sections.map(section => section.ID);

                // confirm that all student tasks loaded are in the list we got from the API
                cy.get('@studentTasksData').then(({ response }) => {
                    for (const studentTask of response.body.data) {
                        expect(studentTask.Task.SectionID, 'Section ID within enrolled section IDs').to.be.oneOf(sectionIds);
                    }
                });
            });
    });

    // todo: ensure we create data that should NOT included in filter
    it('Currently Term, Enrolled Sections Filter', () => {
        let studentUsername = 'student';
        _visitDashboardAsTeacher({ student: studentUsername });
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Current Term');
        _selectFilter('Enrolled Section');

        // get the users sections ids from the current term via the API
        cy.request(`/sections?term=*current&enrolled_user=${studentUsername}&format=json`)
            .then(response => {
                const { data: sections } = response.body;
                const sectionIds = sections.map(section => section.ID);

                // confirm that all student tasks loaded are in the list we got from the API
                cy.get('@studentTasksData').then(({ response }) => {
                    for (const studentTask of response.body.data) {
                        expect(studentTask.Task.SectionID, 'Section ID within enrolled section IDs').to.be.oneOf(sectionIds);
                    }
                });
            });
    });
});


describe('CBL / Tasks / Student Dashboard: Status Filters', () => {

    // todo: ensure we create data that should NOT included in filter
    it('Archived Tasks Filter', () => {
        _visitDashboardAsTeacher();
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Archived Task');

        cy.get('@studentTasksData').then(({ response }) => {
            const archived = response.body.data.filter(studentTask => studentTask.Task.Status.toLowerCase() === 'archived');
            expect(archived.length, 'at least one archived task included').to.be.greaterThan(0);
        });
    });

    // todo: ensure we create data that should NOT included in filter
    it('Revision Tasks Filter', () => {
        _visitDashboardAsTeacher();
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Revision Tasks', '.slate-tasktree-status-revision');
    });

    // todo: ensure we create data that should NOT included in filter
    it('Due Tasks Filter', () => {
        _visitDashboardAsTeacher();
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Due Tasks', '.slate-tasktree-status-due, .slate-tasktree-status-late');
    });
});


describe('CBL / Tasks / Student Dashboard: Timeline Filters', () => {

    // todo: ensure we create data that should NOT included in filter
    it('Past Due Filter', () => {
        _visitDashboardAsTeacher();
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Past Due', '.slate-tasktree-status-late');

        // check due dates of remaining tasks
        cy.extGet('slate-tasks-student-tasktree')
            .find('.slate-tasktree-item')
            .each($task => {
                const date = dayjs($task.find('.slate-tasktree-date').text(), 'MMM, DD YYYY');
                const isAfter = today.isAfter(date, 'day') || today.isSame(date, 'day');
                expect(isAfter, 'Due date is before current date').to.equal(true);
            });
    });

    it('Completed Tasks Filter', () => {
        _visitDashboardAsTeacher();
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Completed Tasks', '.slate-tasktree-status-completed');
    });

    it('Due Today Tasks Filter', () => {
        _visitDashboardAsTeacher();
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Due Today', '.slate-tasktree-status-due, .slate-tasktree-status-revision');

        // check due dates of remaining tasks
        cy.extGet('slate-tasks-student-tasktree')
            .find('.slate-tasktree-item')
            .each($task => {
                const date = dayjs($task.find('.slate-tasktree-date').text(), 'MMM, DD YYYY');
                const dueToday = today.isSame(date, 'day');
                expect(dueToday, 'Due date is same as current date').to.equal(true);
            });
    });

    it('Due This Week Tasks Filter', () => {
        _visitDashboardAsTeacher();
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Due This Week', '.slate-tasktree-status-due, .slate-tasktree-status-revision');

        // check due dates of remaining tasks
        const startOfNextWeek = today.add(8, 'day');
        const yesterday = today.subtract(1, 'day');

        cy.extGet('slate-tasks-student-tasktree')
            .find('.slate-tasktree-item')
            .each($task => {
                const date = dayjs($task.find('.slate-tasktree-date').text(), 'MMM, DD YYYY');
                const dateIsBetween = date.isBetween(yesterday, startOfNextWeek);
                expect(dateIsBetween, 'Due date between yesterday and next week').to.be.true;
            });
    });

    it('Due Next Week Tasks Filter', () => {
        _visitDashboardAsTeacher();
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Due Next Week', '.slate-tasktree-status-due, .slate-tasktree-status-revision');

        // check due dates of remaining tasks
        const endOfThisWeek = today.add(7, 'day');

        cy.extGet('slate-tasks-student-tasktree')
            .find('.slate-tasktree-item')
            .each($task => {
                const date = dayjs($task.find('.slate-tasktree-date').text(), 'MMM, DD YYYY');
                console.log('first date below should be after second one');
                console.log(date);
                console.log(endOfThisWeek);
                const isAfter = date.isAfter(endOfThisWeek);
                expect(isAfter, 'Due date after this week').to.be.true;
            });
    });

    it('Due Recently Upcoming Tasks Filter', () => {
        _visitDashboardAsTeacher();
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Due (recently/upcoming)', '.slate-tasktree-status-due, .slate-tasktree-status-revision, .slate-tasktree-status-late');

        // check due dates of remaining tasks
        const tenDaysAgo = today.subtract(10, 'day');
        const tenDaysFromNow = today.add(10, 'day');

        cy.extGet('slate-tasks-student-tasktree')
            .find('.slate-tasktree-item')
            .each($task => {
                const date = dayjs($task.find('.slate-tasktree-date').text(), 'MMM, DD YYYY');
                const isBetween = date.isBetween(tenDaysAgo, tenDaysFromNow);
                expect(isBetween, 'Due date between 10 day ago and 10 days from now').to.be.true;
            });
    });

    it('Due Tasks (no date) Filter', () => {
        _visitDashboardAsTeacher();
        _clickFilterButton();
        _deselectAllFilters();
        _selectFilter('Due (no date)');

        // wait for filter to be effective
        cy.extGet('slate-tasks-student-tasktree')
            .should('not.have.class', 'is-loading')
            .find('.slate-tasktree-item')
            .should($tasks => {
                const $includedTasks = $tasks.find('.slate-tasktree-date:empty');
                const $excludedTasks = $tasks.find('.slate-tasktree-date:not(:empty)');
                expect($includedTasks.length, 'some included items present').to.be.gt(0);
                expect($excludedTasks.length, 'no excluded items present').to.equal(0);
            });
    });
});