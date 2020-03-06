describe('Student tasks test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    it('View single task as student', () => {
        cy.loginAs('student');
        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/student');

        // verify student redirect
        cy.location('hash').should('eq', '#me/all');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {

            // get current tasks list
            var currentTasksTree = extQuerySelector('slate-tasks-student-tasktree');

            cy.get('#' + currentTasksTree.id)
                .contains('Filter')
                .click();

            var filterMenu = currentTasksTree.down('slate-tasks-student-taskfiltersmenu');

            cy.get('#' + filterMenu.id)
                .contains('View All')
                .click();

            // verify content has finished loading
            cy.get('#' + currentTasksTree.id)
                .contains('ELA Task One')

            // get the course section element
            var courseSectionSelector = extQuerySelector('slate-cbl-sectionselector');

            // click the selector
            cy.get('#' + courseSectionSelector.el.dom.id).click();

            // click ELA Studio element of picker dropdown
            cy.get('#' + courseSectionSelector.getPicker().id + ' .x-boundlist-item')
                .contains('ELA Studio')
                .click();

            // verify hash
            cy.location('hash').should('eq', '#me/ELA-001');

            // verify content loads
            cy.get('#' + currentTasksTree.id)
                .contains('ELA Task One')
        });
    });

    it('Filters Student Tasks Properly', () => {
        const expectedFilterLengths = {
            // section filters
            'Current Year any Term': 8,
            'Currently Enrolled Sections': 7,

            // status filters
            'Due Tasks': 6,
            // 'Revision Tasks': 0,
            // 'Submitted Tasks': 0,
            'Completed Tasks': 2,
            // 'Un-archived Tasks': 0,

            // timeline filters
            'Past Due': 1,
            'Due Today': 1,
            'Due This Week': 2,
            'Due Next Week': 1,
            'Due (recently/upcoming)': 4,
            'Due (no date)': 4
        };

        cy.loginAs('teacher');

        cy.server().route('GET', '/cbl/student-tasks*').as('studentTasksData');
        cy.server().route('GET', '/cbl/student-tasks?taskstatus=&student=student&course_section=&include=Submitted,Task.Section').as('allStudentTasksData');

        // create some relatively due tasks
        cy.request('POST', `/cbl/tasks/save?format=json`, {
            data: [{
                Title: 'Test Task (Due Today)',
                DueDate: Cypress.moment().format('YYYY-MM-DD'),
                SectionID: 2,
                Assignees: {
                    'student': true
                }
            }, {
                Title: 'Test Task (Due This Week)',
                DueDate: Cypress.moment().add(5, 'days').format('YYYY-MM-DD'),
                SectionID: 2,
                Assignees: {
                    'student': true
                }
            }, {
                Title: 'Test Task (Due Recently)',
                DueDate: Cypress.moment().subtract(9, 'days').format('YYYY-MM-DD'),
                SectionID: 2,
                Assignees: {
                    'student': true
                }
            }, {
                Title: 'Test Task (Due Next Week)',
                DueDate: Cypress.moment().add(8, 'days').format('YYYY-MM-DD'),
                SectionID: 2,
                Assignees: {
                    'student': true
                }
            }, {
                Title: 'Test Task (No Due Date)',
                SectionID: 2,
                Assignees: {
                    'student': true
                }
            }]
        });

        cy.visit('/cbl/dashboards/tasks/student#student/all');
        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {
            cy.get('.slate-appcontainer')
                .should('be.visible')
                .then(() => {
                    const currentTasksTree = extQuerySelector('slate-tasks-student-tasktree'),
                        filterMenu = currentTasksTree.down('slate-tasks-student-taskfiltersmenu'),
                        _selectFilter = (filterText, filterId = filterMenu.id) => {
                            return cy.get('#' + filterId)
                                .should('be.visible')
                                .contains(filterText)
                                .click();
                        },
                        _viewAll = () => {
                            return _selectFilter('View All');
                        };

                    cy.wait(['@studentTasksData'])
                        .its('status')
                        .should('eq', 200)
                        .then(() => {
                            // verify content has finished loading
                            cy.contains('Loading Tasks')
                                .should('not.be.visible')
                                .then(() => {
                                    cy.get('#' + currentTasksTree.id)
                                        .should(($tasksTree) => {
                                            expect($tasksTree.find('li.slate-tasktree-item').length)
                                                .to.equal(5);
                                        });
                                });
                        });

                    cy.get('#' + currentTasksTree.id)
                        .contains('Filter')
                        .click()
                        .then(() => {
                            for (let [filter, length] of Object.entries(expectedFilterLengths)) {
                                _viewAll();
                                _selectFilter(filter);
                                cy.wait(['@allStudentTasksData', '@studentTasksData'])
                                    .then((xhrs) => {
                                        xhrs.forEach(x => expect(x.status).to.equal(200));

                                        cy.contains('Loading Tasks')
                                            .should('not.be.visible')
                                            .then(() => {
                                                cy.get('#' + currentTasksTree.id)
                                                    .should(($tasksTree) => {
                                                        expect(
                                                            $tasksTree.find('li.slate-tasktree-item').length
                                                        ).to.equal(length)
                                                    });
                                            });

                                    });
                            }
                        });
                });
        });
    });
});