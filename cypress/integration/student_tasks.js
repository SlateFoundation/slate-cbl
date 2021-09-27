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
        // // create some relatively due tasks
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
        cy.server().route('GET', '/cbl/dashboards/tasks/student/bootstrap*').as('bootstrapData');
        cy.server().route('GET', '/cbl/skills*').as('skillsData');
        cy.server().route('GET', '/cbl/competencies*').as('competenciesData');
        cy.server().route('GET', '/cbl/student-tasks*').as('studentTasksData');
        cy.server().route('GET', '/cbl/todos/*groups*').as('studentTodosData');
        cy.server().route('POST', '/cbl/student-tasks/save*').as('studentTasksSave');
    });

    const _visitDashboardAsStudent = (student = 'student') => {
        cy.loginAs(`${student}`);
        cy.visit(`/cbl/dashboards/tasks/student`);

        cy.wait(['@bootstrapData', '@studentTasksData'])
            .should((xhrs) => {
                xhrs.forEach(
                    xhr => {
                        expect(xhr.status).to.equal(200);
                    }
                )
            });
    };
    const _visitDashboardAsTeacher = ({ teacher = 'teacher', student = 'student' } = {}) => {
        cy.loginAs(`${teacher}`);
        cy.visit(`/cbl/dashboards/tasks/student#${student}/all`);

        cy.wait(['@bootstrapData', '@studentTasksData'])
            .should((xhrs) => {
                xhrs.forEach(
                    xhr => {
                        expect(xhr.status).to.equal(200);
                    }
                )
            });
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
                                .then((el) => {
                                    cy.wait('@studentTasksData').should((xhr) => {
                                        cy.wrap(xhr).its('status').should('eq', 200);
                                        resolve({
                                            el,
                                            xhr,
                                        });
                                    });
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
                            cy.wait('@studentTasksData').its('status').should('eq', 200).then(() => resolve(items));
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
                    cy.wait(500) // wait for dom to re-render
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
                                .should((xhrs) => {
                                    xhrs.forEach(
                                        xhr => {
                                            expect(xhr.status).to.equal(200);
                                            expect(xhr.response.body.success).to.be.true;
                                        }
                                    );
                                });

                            cy.get('.slate-window')
                                .contains('Submit Assignment')
                                .should((btn) => {
                                    expect(btn).to.be.visible;
                                    expect(btn.attr('aria-disabled')).to.not.be.true;
                                })
                                .click({ force: true })

                            cy.wait('@studentTasksSave')
                                .should(xhr => {
                                    expect(xhr.status).to.equal(200);
                                    expect(xhr.response.body.success).to.be.true;
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
                            .click({ force: true })

                        cy.get('.slate-window')
                            .contains('Save Assignment')
                            .should((btn) => {
                                expect(btn).to.be.visible;
                                expect(btn.attr('aria-disabled')).to.not.be.true;
                            })
                            .click({ force: true });

                        cy.wait('@studentTasksSave')
                            .should(xhr => {
                                expect(xhr.status).to.equal(200);
                                expect(xhr.response.body.success).to.be.true;
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
                    .then(({ xhr }) => {
                        const { data: studentTasks } = xhr.response.body;
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
                    .then(( xhr ) => {
                        const { data: studentTasks } = xhr.response.body;

                        // get the users sections ids from the current term via the API
                        cy.request(`/sections?term=*current&enrolled_user=${studentUsername}&format=json`).as('currentSections');
                        cy.get('@currentSections').then((response) => {
                            const { data: sections } = response.body;
                                sectionIds = sections.map(section => section.ID);

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
                    .then(({ xhr: { response } }) => {
                        // expect there to be at least 1 archived task that was created in the 'before' method
                        expect(response.body.data.map(studentTask => studentTask.Task.Status.toLowerCase() === 'archived').length).to.be.greaterThan(0);
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
                    .then(({ response }) => {
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
                    .then(({ response }) => {
                        // expect there to be at least 1 archived task that was created in the 'before' method
                        // expect(response.body.data.map(studentTask => studentTask.Task.Status.toLowerCase() === 'archived').length).to.be.greaterThan(0);
                        cy.wait(500); // allow dom re-render

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
                    cy.wait(500); // allow dom re-render

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
    it('Submitted Tasks Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Submitted Tasks'))
            .then(({ response }) => {
                cy.wait(500); // allow dom re-render
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        cy.get($item).find('.slate-tasktree-status').contains('Submitted'); // confirm the status text exists
                    });
            })
        })
    })

    it('Completed Tasks Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Completed Tasks'))
            .then(({ response }) => {
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

    //this test could be shorter if we make an API call and test the data instead of clicking on every li element
    it('Due Today Tasks Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Due Today'))
            .then(({ response }) => {
                cy.wait(500); // allow dom re-render
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        cy.get($item).click()
                        //waiting 1 sec to ensure modal loads with data
                        cy.wait(1000)
                        // will need to use sencha to select component instead of current selector
                        cy.get('#slate-window-1049-body').contains(dayjs().format('YYYY-MM-DD'))
                       // will need to use sencha to select component instead of current selector
                        cy.get('#tool-1091-toolEl')
                        .click()
                        cy.wait(1000)
                        //waiting 1 sec to ensure modal is closed before next li element is clicked
                    });
            })
        })
    })

    //this test could be shorter if we make an API call and test the data instead of clicking on every li element
    it('Due This Week Tasks Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Due This Week'))
            .then(({ response }) => {
                cy.wait(500); // allow dom re-render
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        cy.get($item)
                        cy.get($item).click()
                        //waiting 1 sec to ensure modal loads with data
                        cy.wait(1000)
                        // will need to use sencha to select component instead of current selector
                        cy.get('#displayfield-1060-inputEl').then(($input) => {
                            const taskDate = $input.text()
                            let inOneWeek = dayjs().add(8, 'day').format('YYYY-MM-DD')
                            let yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
                            const dateIsBetween = dayjs(taskDate).isBetween(yesterday, dayjs(inOneWeek));
                            expect(dateIsBetween).to.be.true;
                            // will need to use sencha to select component instead of current selector
                            cy.get('#tool-1091-toolEl')
                            .click()
                            cy.wait(1000)
                            //waiting 1 sec to ensure modal is closed before next li element is clicked
                        })
                    });
            })
        })
    })

    //this test could be shorter if we make an API call and test the data instead of clicking on every li element
    it('Due Next Week Tasks Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Due Next Week'))
            .then(({ response }) => {
                cy.wait(500); // allow dom re-render
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        cy.get($item)
                        cy.get($item).click()
                        //waiting 1 sec to ensure modal loads with data
                        cy.wait(1000)
                        // will need to use sencha to select component instead of current selector
                        cy.get('#displayfield-1060-inputEl').then(($input) => {
                            const taskDate = $input.text()
                            let inOneWeek = dayjs().add(6, 'day').format('YYYY-MM-DD')
                            const isAfter = dayjs(taskDate).isAfter(inOneWeek);
                            expect(isAfter).to.be.true;
                            // will need to use sencha to select component instead of current selector
                            cy.get('#tool-1091-toolEl')
                            .click()
                            cy.wait(1000)
                                //waiting 1 sec to ensure modal is closed before next li element is clicked
                        })
                    });
            })
        })
    })

    //this test could be shorter if we make an API call and test the data instead of clicking on every li
    it('Due Recently Upcoming Tasks Filter', ()=>{
        _visitDashboardAsTeacher();
        _setupTests()
        .then(({ _deselectAllFilters, _selectFilter, _clickFilterButton, currentTasksTree }) => {
            _clickFilterButton()
            .then(_deselectAllFilters)
            .then(() => _selectFilter('Due Next Week'))
            .then(({ response }) => {
                cy.wait(500); // allow dom re-render
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        cy.get($item)
                        cy.get($item).click()
                        //waiting 1 sec to ensure modal loads with data
                        cy.wait(1000)
                        // will need to use sencha to select component instead of current selector
                        cy.get('#displayfield-1060-inputEl').then(($input) => {
                            const taskDate = $input.text()
                            let lastTenDays = dayjs().subtract(10, 'day').format('YYYY-MM-DD')
                            let nextTenDays = dayjs().add(10, 'day').format('YYYY-MM-DD')
                            const dateIsBetween = dayjs(taskDate).isBetween(lastTenDays, dayjs(nextTenDays));
                            expect(dateIsBetween).to.be.true;
                            // will need to use sencha to select component instead of current selector
                            cy.get('#tool-1091-toolEl')
                            .click()
                            cy.wait(1000)
                                //waiting 1 sec to ensure modal is closed before next li element is clicked
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
            .then(({ response }) => {
                cy.wait(500); // allow dom re-render
                cy.get('#' + currentTasksTree.id)
                    .find('ul.slate-tasktree-list')
                    .children('li.slate-tasktree-item')
                    .each(($item) => {
                        // checking UI for strings in values array
                        const values = ['Due', "Completed"]
                        const regex = new RegExp(`${values.join('|')}`, 'g')
                        cy.get($item).find('.slate-tasktree-status')
                        .contains(regex); // confirm the status text exists
                    });
            })
        })
    })
});