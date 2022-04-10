describe('Student Tasks test', () => {
    const dayjs = require('dayjs'),
        isBetween = require('dayjs/plugin/isBetween');

    // todo: confirm this is still needed
    dayjs.extend(isBetween);


    // load sample database before tests
    before(() => {
        cy.resetDatabase();

        // create time relative tasks
        cy.loginAs('teacher');

        // create some relatively due tasks
        cy.request('POST', `/cbl/tasks/save?format=json`, {
            data: [{
                Title: 'Test Task (Due Today)',
                DueDate: dayjs().format('YYYY-MM--DD'),
                SectionID: 2,
                Assignees: {
                    'student': true
                }
            }, {
                Title: 'Test Task (Due This Week)',
                DueDate: dayjs().add(5, 'day').format('YYYY-MM--DD'),
                SectionID: 2,
                Assignees: {
                    'student': true
                }
            }, {
                Title: 'Test Task (Due Recently)',
                DueDate: dayjs().subtract(9, 'day').format('YYYY-MM--DD'),
                SectionID: 2,
                Assignees: {
                    'student': true
                }
            }, {
                Title: 'Test Task (Due Next Week)',
                DueDate: dayjs().add(8, 'day').format('YYYY-MM--DD'),
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
        cy.intercept('GET', '/cbl/dashboards/tasks/student/bootstrap*').as('bootstrapData');
        cy.intercept('GET', '/cbl/skills*').as('skillsData');
        cy.intercept('GET', '/cbl/competencies*').as('competenciesData');
        cy.intercept('GET', '/cbl/student-tasks*').as('studentTasksData');
        cy.intercept('GET', '/cbl/todos/*groups*').as('studentTodosData');
        cy.intercept('POST', '/cbl/student-tasks/save*').as('studentTasksSave');
    });

    const _visitDashboardAsStudent = (student = 'student') => {
        cy.loginAs(`${student}`);
        cy.visit(`/cbl/dashboards/tasks/student`);

        cy.wait('@studentTasksData')
            .its('response.statusCode')
            .should('eq', 200);
    };
    const _visitDashboardAsTeacher = ({ teacher = 'teacher', student = 'student' } = {}) => {
        cy.loginAs(`${teacher}`);
        cy.visit(`/cbl/dashboards/tasks/student#${student}/all`);

        cy.wait('@studentTasksData')
            .its('response.statusCode')
            .should('eq', 200);
    };

    const _setupTests = () => {
        return new Cypress.Promise(resolve => {

            cy.withExt().then(({extQuerySelector}) => {
                 const currentTasksTree = extQuerySelector('slate-tasks-student-tasktree'),
                    filterMenu = currentTasksTree.down('slate-tasks-student-taskfiltersmenu'),
                    _selectFilter = (filterText, filterId = filterMenu.id) => {
                        return new Cypress.Promise((resolve) => {
                            cy.get('#' + filterId)
                                .contains(filterText)
                                .click({ force: true}) // force click if element isn't visible
                                .then(() => {
                                    cy.wait('@studentTasksData')
                                        .its('response')
                                        .then(response => {
                                            expect(response.statusCode).to.equal(200);

                                            // allow dom re-render
                                            cy.wait(200).then(() => resolve(response.body));
                                        })
                                })
                        });

                    },
                    _viewAll = () => {
                        return _selectFilter('View All');
                    },
                    _deselectAllFilters = () => {
                        return new Cypress.Promise(resolve => {
                            let items = filterMenu.query('menucheckitem[checked]');
                            items.forEach((i, idx, items) => {
                                i.setChecked(false);
                                // if (idx === items.length - 1) {
                                // }
                            });
                            cy.wait('@studentTasksData')
                                .its('response.statusCode')
                                .should('eq', 200)
                                .then(() => resolve(items));
                        });
                    },
                    _clickFilterButton = () => {
                        return new Cypress.Promise(resolve => {
                            cy.get('#' + currentTasksTree.id)
                                .contains('Filter')
                                .click({ force: true })
                                .then(tree => resolve(tree));
                        });
                    };

                resolve({
                    _selectFilter,
                    _viewAll,
                    _deselectAllFilters,
                    _clickFilterButton,
                    currentTasksTree,
                    filterMenu,
                });
            });
        });
    };

    // Workflow Tests
    it('Submit task as student / Re-Assign As Teacher', () => {
        // todo: create task in test? we want to make sure tests don't fail because of previous test failures or successes
        let studentUsername = 'student',
            teacherUsername = 'teacher';

        cy.loginAs(teacherUsername);
        cy.request('POST', `/cbl/tasks/save?format=json`, {
            data: [{
                Title: 'Test Task (Revision Workflow)',
                DueDate: dayjs().format('YYYY-MM--DD'),
                SectionID: 2,
                Assignees: {
                    'student': true
                }
            }]
        });

        _visitDashboardAsStudent(studentUsername);
        _setupTests().then(({ _clickFilterButton, _selectFilter, _deselectAllFilters, currentTasksTree }) => {
            return _clickFilterButton()
                .then(_deselectAllFilters)
                .then(() => _selectFilter('Due'))
                .then(() => {
                    cy.wait(2000) // wait for dom to re-render
                        .then(() => {
                            cy.get('#' + currentTasksTree.id)
                                .contains('Revision Workflow')
                                .click({ force: true })
                                // .find('li.slate-tasktree-item')
                                // .then((found) => {
                                //     cy.get(found.first())
                                //         .scrollIntoView()
                                //         .click();
                                // })
                            cy.wait(['@skillsData', '@competenciesData'])
                                .should(intercepts => {
                                    for (const { response } of intercepts) {
                                        expect(response.statusCode).to.equal(200);
                                        expect(response.body.success).to.be.true;
                                    }
                                });

                            cy.get('.slate-window')
                                .contains('Submit Assignment')
                                .should((btn) => {
                                    expect(btn).to.be.visible;
                                    expect(btn.attr('aria-disabled')).to.not.be.true;
                                })
                                .click({ force: true })

                            cy.wait('@studentTasksSave')
                                .should(({ response }) => {
                                    expect(response.statusCode).to.equal(200);
                                    expect(response.body.success).to.be.true;
                                });

                            cy.get('#' + currentTasksTree.id)
                                .contains('Submitted');

                        });
                })
        }).then(() => {
            // re-assign as teacher
            _visitDashboardAsTeacher({
                student: studentUsername,
                teacher: teacherUsername,
            })
            _setupTests().then(({ _clickFilterButton, _deselectAllFilters, _selectFilter, currentTasksTree }) => {
                cy.get('.slate-appcontainer')
                    .should('be.visible');

                _clickFilterButton()
                    .then(_deselectAllFilters)
                    .then(() => _selectFilter('Submitted'))
                    .then(() => {
                        cy.get('#' + currentTasksTree.getId())
                            .contains('Revision Workflow')
                            .click({ force: true })

                        cy.get('.slate-window')
                            .contains('label', 'Re-assign')
                            .click()

                        cy.get('.slate-window')
                            .contains('Save Assignment')
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

                        cy.get('#' + currentTasksTree.id)
                            .contains('.slate-tasktree-status', 'Revision');
                    })


            });
        })
    });

    // Section Filters
    // todo: ensure we create data that should NOT included in filter
    it('Enrolled Sections Filter', () => {
        let studentUsername = 'student';
        _visitDashboardAsTeacher({ student: studentUsername });
        _setupTests()
            .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton }) => {
                _clickFilterButton()
                    .then(_deselectAllFilters)
                    .then(() => _selectFilter('Enrolled Sections'))
                    .then(({ data: studentTasks }) => {
                        // get the users sections ids from the current term via the API
                        cy.request(`/sections?enrolled_user=${studentUsername}&format=json`).as('currentSections');
                        cy.get('@currentSections').then((response) => {
                            const { data: sections } = response.body,
                                sectionIds = sections.map(section => section.ID);
                            // confirm that all student tasks loaded are in the list we got from the API
                            studentTasks.forEach(studentTask => {
                                expect(studentTask.Task.SectionID, 'Section ID within enrolled section IDs').to.be.oneOf(sectionIds);
                            });
                        });
                })
            });
    });

    // todo: ensure we create data that should NOT included in filter
    it('Currently Term, Enrolled Sections Filter', () => {
        let studentUsername = 'student';
        _visitDashboardAsTeacher({ student: studentUsername });
        _setupTests()
            .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton }) => {
                _clickFilterButton()
                    .then(_deselectAllFilters)
                    .then(() => _selectFilter('Current Term'))
                    .then(() => _selectFilter('Enrolled Section'))
                    .then(({ data: studentTasks }) => {
                        // get the users sections ids from the current term via the API
                        cy.request(`/sections?term=*current&enrolled_user=${studentUsername}&format=json`).as('currentSections');
                        cy.get('@currentSections').then((response) => {
                            const { data: sections } = response.body;
                            const sectionIds = sections.map(section => section.ID);

                            // confirm that all student tasks loaded are in the list we got from the API
                            studentTasks.forEach(studentTask => {
                                expect(studentTask.Task.SectionID).to.be.oneOf(sectionIds);
                            });
                        });

                })
            });
    });

    // Status Filters
    // todo: ensure we create data that should NOT included in filter
    it('Archived Tasks Filter', () => {
        _visitDashboardAsTeacher();
        _setupTests()
            .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton }) => {
                _clickFilterButton()
                    .then(_deselectAllFilters)
                    .then(() => _selectFilter('Archived Task'))
                    .then(({ data }) => {
                        // expect there to be at least 1 archived task that was created in the 'before' method
                        expect(data.map(studentTask => studentTask.Task.Status.toLowerCase() === 'archived').length).to.be.greaterThan(0);
                    })
            })
    });

    // todo: ensure we create data that should NOT included in filter
    it('Revision Tasks Filter', () => {
        _visitDashboardAsTeacher();
        _setupTests()
            .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
                _clickFilterButton()
                    .then(_deselectAllFilters)
                    .then(() => _selectFilter('Revision Tasks'))
                    .then(() => {
                        // expect there to be at least 1 archived task that was created in the 'before' method
                        cy.wait(1000); // allow dom re-render

                        cy.get('#' + currentTasksTree.getId())
                            .find('ul.slate-tasktree-list')
                            .children('li.slate-tasktree-item')
                            .each(($item) => {
                                cy.get($item).find('.slate-tasktree-status').contains('Revision');
                            });
                    })
            })
    });

    // todo: ensure we create data that should NOT included in filter
    it('Due Tasks Filter', () => {
        _visitDashboardAsTeacher();
        _setupTests()
            .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
                _clickFilterButton()
                    .then(_deselectAllFilters)
                    .then(() => _selectFilter('Due Tasks'))
                    .then(() => {
                        // expect there to be at least 1 archived task that was created in the 'before' method
                        // expect(response.body.data.map(studentTask => studentTask.Task.Status.toLowerCase() === 'archived').length).to.be.greaterThan(0);

                        cy.get('#' + currentTasksTree.getId())
                            .find('ul.slate-tasktree-list')
                            .children('li.slate-tasktree-item')
                            .each(($item) => {
                                cy.get($item).find('.slate-tasktree-status').contains('Due'); // confirm the status text exists
                            });
                    })
            })
    });

    // Timeline Filters
    // todo: ensure we create data that should NOT included in filter
    it('Past Due Filter', () => {
        _visitDashboardAsTeacher();
        _setupTests().then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
                .then(_deselectAllFilters)
                .then(() => _selectFilter('Past Due'))
                .then(() => {
                    cy.get('#' + currentTasksTree.getId())
                        .find('ul.slate-tasktree-list')
                        .children('li.slate-tasktree-item')
                        .each(($item) => {
                            cy.get($item).find('.slate-tasktree-date').should( $date => {

                                let today = dayjs(),
                                    date = dayjs($date.text()),
                                    isAfter = today.isAfter(date, 'day') || today.isSame(date, 'day');

                                // if (!isAfter) {
                                //     debugger;
                                // }

                                console.log({
                                    today,
                                    date,
                                    isAfter,
                                    $date,
                                });
                                expect(isAfter, 'Due date is before current date').to.equal(true);
                            })
                        })
                })
        })
    });

    it('Submitted Tasks Filter', () => {
        const taskTitle = 'Test Task (Submitted)';
        // create the task as teacher and assign to student
        _visitDashboardAsTeacher();
        cy.request('POST', `/cbl/tasks/save?format=json`, {
            data: [{
                Title: taskTitle,
                DueDate: dayjs().format('YYYY-MM--DD'),
                SectionID: 2,
                Assignees: {
                    'student': true
                }
            }]
        });

        // login as student, and submit
        _visitDashboardAsStudent();
        _setupTests().then(({ _clickFilterButton, _selectFilter, _deselectAllFilters, currentTasksTree }) => {
            return _clickFilterButton()
                .then(_deselectAllFilters)
                .then(() => _selectFilter('Due'))
                .then(() => {
                    cy.wait(2000) // wait for dom to re-render
                        .then(() => {
                            cy.get('#' + currentTasksTree.id)
                                .contains(taskTitle)
                                .click({ force: true })

                            cy.wait(['@skillsData', '@competenciesData'])
                                .should(intercepts => {
                                    for (const { response } of intercepts) {
                                        expect(response.statusCode).to.equal(200);
                                        expect(response.body.success).to.be.true;
                                    }
                                });

                            cy.get('.slate-window')
                                .contains('Submit Assignment')
                                .should((btn) => {
                                    expect(btn).to.be.visible;
                                    expect(btn.attr('aria-disabled')).to.not.be.true;
                                })
                                .click({ force: true })

                            cy.wait('@studentTasksSave')
                                .should(({ response }) => {
                                    expect(response.statusCode).to.equal(200);
                                    expect(response.body.success).to.be.true;
                                });

                            cy.get('#' + currentTasksTree.id)
                                .contains('Submitted');

                        });
                })
        })
        .then(() => {
            _visitDashboardAsTeacher();
            _setupTests()
                .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
                    _clickFilterButton()
                    .then(_deselectAllFilters)
                    .then(() => _selectFilter('Submitted Tasks'))
                    .then(() => {
                        cy.get('#' + currentTasksTree.id)
                            .find('ul.slate-tasktree-list')
                            .children('li.slate-tasktree-item')
                            .each(($item) => {
                                cy.get($item).find('.slate-tasktree-status').contains('Submitted'); // confirm the status text exists
                            });
                    })
                })
        })
    });

    it('Completed Tasks Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Completed Tasks'))
            .then(() => {
                cy.wait(500); // allow dom re-render
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        cy.get($item).find('.slate-tasktree-status').contains('Completed'); // confirm the status text exists
                    });
            })
        })
    })

    it('Due Today Tasks Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Due Today'))
            .then(() => {
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        cy.get($item).find('.slate-tasktree-date').should( $date => {
                            let today = dayjs(),
                                date = dayjs($date.text(), 'MMM, DD YYYY'),
                                dueToday = today.isSame(date, 'day');

                            expect(dueToday, 'Due date is same as current date').to.equal(true);
                        })
                    });
            })
        })
    })

    it('Due This Week Tasks Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Due This Week'))
            .then(() => {
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        cy.get($item).find('.slate-tasktree-date').should( $date => {
                              const date = dayjs($date.text(), 'MMM, DD YYYY'),
                                 inOneWeek = dayjs().add(8, 'day').format('MMM, DD YYYY'),
                                 yesterday = dayjs().subtract(1, 'day').format('MMM, DD YYYY'),
                                 dateIsBetween = dayjs(date).isBetween(yesterday, dayjs(inOneWeek));

                                 expect(dateIsBetween).to.be.true;
                        })
                    });
            })
        })
    })

    it('Due Next Week Tasks Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Due Next Week'))
            .then(() => {
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        cy.get($item).find('.slate-tasktree-date').should( $date => {
                              const date = dayjs($date.text(), 'MMM, DD YYYY'),
                                inOneWeek = dayjs().add(7, 'day').format('MMM, DD YYYY'),
                                isAfter = dayjs(date).isAfter(inOneWeek);
                                console.log({date, inOneWeek, isAfter})

                                 expect(isAfter).to.be.true;
                        })
                    });
            })
        })
    })

    it('Due Recently Upcoming Tasks Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Due Next Week'))
            .then(() => {
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        cy.get($item).find('.slate-tasktree-date').should( $date => {
                              const date = dayjs($date.text(), 'MMM, DD YYYY'),
                               lastTenDays = dayjs().subtract(10, 'day').format('MMM, DD YYYY'),
                               nextTenDays = dayjs().add(10, 'day').format('MMM, DD YYYY'),
                               dateIsBetween = dayjs(date).isBetween(lastTenDays, dayjs(nextTenDays));

                              expect(dateIsBetween).to.be.true;
                        })
                    });
            })
        })
    })

    it('Due Tasks (no date) Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Due (no date)'))
            .then(() => {
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        cy.get($item).find('.slate-tasktree-date').should( $date => {
                            expect($date.text(), 'The date should be empty').to.be.empty;
                        })
                    });
            })
        })
    })
});