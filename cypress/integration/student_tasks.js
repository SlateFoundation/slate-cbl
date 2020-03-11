describe('Student tasks test', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();

        // create time relative tasks
        cy.loginAs('teacher');
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
            }, {
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
        cy.server().route('GET', '/cbl/dashboards/tasks/student/bootstrap*').as('bootstrapData');
        cy.server().route('GET', '/cbl/student-tasks*').as('studentTasksData');
        cy.server().route('GET', '/cbl/todos/*groups*').as('studentTodosData');
        cy.server().route('POST', '/cbl/student-tasks/save*').as('studentTasksSave');
    });

    it('View single task as student', () => {
        cy.loginAs('student');
        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/student');

        // verify student redirect
        cy.location('hash').should('eq', '#me/all');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {
            cy.wait(['@studentTasksData', '@studentTodosData'])
                .should((xhrs) => {
                    xhrs.forEach(xhr => expect(xhr.status).to.equal(200));

                    var todoList = extQuerySelector('slate-tasks-student-todolist');

                    cy.get('#'+todoList.id)
                        .find('.slate-todolist-section')
                        .should(($todoListSection) => {
                            expect(
                                $todoListSection.length
                            ).to.equal(3);
                        })
                })
                .then(() => {
                    // get current tasks list
                    var currentTasksTree = extQuerySelector('slate-tasks-student-tasktree');

                    cy.get('#' + currentTasksTree.id)
                        .contains('Filter')
                        .click();

                    var filterMenu = currentTasksTree.down('slate-tasks-student-taskfiltersmenu');

                    cy.get('#' + filterMenu.id)
                        .contains('View All')
                        .click();

                    cy.wait('@studentTasksData')
                        .should(xhr => {
                            expect(xhr.status).to.equal(200);
                        });

                    // verify content has finished loading
                    cy.get('#' + currentTasksTree.id)
                        .contains('ELA Task One')

                    // get the course section element
                    var courseSectionSelector = extQuerySelector('slate-cbl-sectionselector');

                    // click the selector
                    cy.get('#' + courseSectionSelector.el.dom.id).click();

                    // click ELA Studio element of picker dropdown
                    cy.get('#' + courseSectionSelector.getPicker().id)
                        .contains('ELA Studio')
                        .click({force: true}); // test sometimes fails because the element is not visible

                    cy.wait('@studentTasksData')
                        .should(({status}) => {
                            expect(status).to.equal(200);
                        });
                    });
        });
    });

    it('Submit task as student', () => {
        cy.loginAs('student');
        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/student');

        // verify student redirect
        cy.location('hash').should('eq', '#me/all');

        cy.withExt().then(({extQuerySelector}) => {

            // get current tasks list
            const currentTasksTree = extQuerySelector('slate-tasks-student-tasktree');

            cy.get('#' + currentTasksTree.id)
                .contains('Filter')
                .click();

            const filterMenu = currentTasksTree.down('slate-tasks-student-taskfiltersmenu');

            cy.get('#' + filterMenu.id)
                .contains('View All')
                .click();

            // verify content has finished loading
            cy.get('#' + currentTasksTree.id)
                .contains('ELA Task One');


            cy.get('#' + currentTasksTree.id)
                .contains('(Due Today)')
                .click()
                .then(() => {

                    const slateWindow = extQuerySelector('slate-cbl-tasks-studenttaskform ^ window');

                    cy.get('#' + slateWindow.id)
                        .contains('Submit Assignment')
                        .click();

                    cy.wait('@studentTasksSave')
                        .its('status')
                        .should('eq', 200);

                    cy.get('#' + currentTasksTree.id)
                        .contains('Submitted');
                });


        });
    });

    it('Re-Assign task as teacher', () => {
        cy.loginAs('teacher');
        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/tasks/student#student/');

        cy.withExt().then(({ extQuerySelector }) => {
            cy.get('.slate-appcontainer')
                .should('be.visible')
                .then(() => {
                    cy.wait(['@bootstrapData', '@studentTasksData'])
                        .should((xhrs) => {
                            xhrs.forEach(xhr => expect(xhr.status).to.equal(200));
                        });

                    const currentTasksTree = extQuerySelector('slate-tasks-student-tasktree');


                    cy.get('#' + currentTasksTree.id)
                        .contains('Filter')
                        .click();

                    const filterMenu = currentTasksTree.down('slate-tasks-student-taskfiltersmenu');

                    cy.get('#' + filterMenu.id)
                        .contains('View All')
                        .click();

                    cy.get('#' + currentTasksTree.id)
                        .contains('(Due This Week)')
                        .click()
                        .then(() => {
                            const slateWindow = extQuerySelector('slate-cbl-tasks-studenttaskform ^ window');

                            cy.get('#' + slateWindow.id)
                                .contains('label', 'Re-assign')
                                .click();

                            cy.get('#' + slateWindow.id)
                                .contains('Save Assignment')
                                .click();
                        });


                    cy.wait('@studentTasksSave')
                        .its('status')
                        .should('eq', 200);

                    cy.get('#' + currentTasksTree.id)
                        .contains('.slate-tasktree-status', 'Revision');

                });
        });

    });

    it('Filters Student Tasks', () => {
        const expectedFilterLengths = {
            // section filters
            'Current Year any Term': 8,
            'Currently Enrolled Sections': 7,

            // status filters
            'Due Tasks': 4,
            'Revision Tasks': 1,
            'Submitted Tasks': 1,
            'Completed Tasks': 2,
            'Archived Tasks': 9,

            // timeline filters
            'Past Due': 1,
            'Due Today': 1,
            'Due This Week': 2,
            'Due Next Week': 1,
            'Due (recently/upcoming)': 4,
            'Due (no date)': 4
        };

        cy.loginAs('teacher');

        cy.visit('/cbl/dashboards/tasks/student#student/all');

        cy.withExt().then(({Ext, extQuerySelector, extQuerySelectorAll}) => {
            cy.get('.slate-appcontainer')
                .should('be.visible')
                .then(() => {
                    const currentTasksTree = extQuerySelector('slate-tasks-student-tasktree'),
                        filterMenu = currentTasksTree.down('slate-tasks-student-taskfiltersmenu'),
                        _selectFilter = (filterText, filterId = filterMenu.id) => {
                            return cy.get('#' + filterId)
                                .contains(filterText)
                                .click({ force: true}); // force click if element isn't visible
                        },
                        _viewAll = () => {
                            return _selectFilter('View All');
                        };

                    cy.wait('@studentTasksData')
                        .should(xhr => {
                            expect(xhr.status).to.equal(200);
                            cy.get('#' + currentTasksTree.id)
                                .should(($tasksTree) => {
                                    expect($tasksTree.find('li.slate-tasktree-item').length)
                                        .to.equal(4);
                                });
                        })
                        .then(() => {
                            cy.get('#' + currentTasksTree.id)
                                .contains('Filter')
                                .click()
                                .then(() => {
                                    for (let [filter, length] of Object.entries(expectedFilterLengths)) {
                                        _viewAll();
                                        cy.wait('@studentTasksData')
                                            .its('status')
                                            .should(status => {
                                                expect(status).to.equal(200);
                                            })
                                            .then(() => {
                                                _selectFilter(filter);

                                                cy.wait('@studentTasksData')
                                                    .should(d => {
                                                        expect(d.status).to.equal(200);
                                                    })
                                                    .and(() => {
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
});