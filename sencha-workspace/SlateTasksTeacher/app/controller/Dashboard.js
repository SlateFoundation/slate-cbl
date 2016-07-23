/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('SlateTasksTeacher.controller.Dashboard', {
    extend: 'Ext.app.Controller',


    // entry points
    control: {
        taskGrid: {
            // competencyrowclick: 'onCompetencyRowClick',
            datacellclick: 'onGridDataCellClick',
            editstudenttask: 'onEditStudentTask',
            ratestudenttask: 'onRateStudentTask'
        },

        dashboardCt: {
            coursesectionselect: 'onDashboardSectionChange'
        },

        courseSelector: {
            select: 'onCourseSectionSelect'
        },

        assignmentsComboField: {
            render: 'onAssigneeComboRender'
        },

        'slate-tasks-teacher-taskrater button[action=accept]': {
            click: 'onAcceptTaskClick'
        },
        'slate-tasks-teacher-taskrater button[action=reassign]': {
            click: 'onAssignRevisionClick'
        },
        'slate-tasks-teacher-taskrater button[action=unassign]': {
            click: 'onUnassignStudentTaskClick'
        },
        'slate-tasks-teacher-taskrater button[action=edit]': {
            click: 'onEditStudentTaskClick'
        },
        'slate-tasks-teacher-taskrater slate-ratingview' : {
            rateskill: 'onRateSkillClick'
        },
        'slate-tasks-teacher-dashboardtoolbar button[action=delete]': {
            click: 'onDeleteTaskClick'
        },
        'slate-tasks-teacher-dashboardtoolbar button[action=edit]': {
            click: 'onEditTaskClick'
        },
        'slate-tasks-teacher-dashboardtoolbar button[action=create]': {
            click: 'onCreateTaskClick'
        },
        'slate-tasks-teacher-taskeditor button[action=save]': {
            click: 'onSaveTaskClick'
        }
    },


    // controller configuration
    views: [
        'Dashboard',
        'TaskEditor',
        'TaskRater'
    ],

    stores: [
        'Tasks',
        'Students',
        'StudentTasks@Slate.cbl.store',
        'Skills@Slate.cbl.store'
    ],

    routes: {
        'section/:sectionId': {
            sectionId: '[\\d]',
            action: 'viewCourseSection'
        }
    },

    refs: {
        dashboardCt: {
            selector: 'slate-tasks-teacher-dashboard',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-dashboard'
        },
        taskEditor: {
            selector: 'slate-tasks-teacher-taskeditor',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-taskeditor'
        },
        taskRater: {
            selector: 'slate-tasks-teacher-taskrater',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-taskrater'
        },
        taskEditorForm: 'slate-tasks-teacher-taskeditor slate-modalform',
        skillsField: 'slate-tasks-teacher-taskeditor slate-skillsfield',
        attachmentsField: 'slate-tasks-teacher-taskeditor slate-tasks-attachmentsfield',
        assignmentsField: 'slate-tasks-teacher-taskeditor slate-tasks-assignmentsfield',
        assignmentsComboField: 'slate-tasks-teacher-taskeditor slate-tasks-assignmentsfield combo',
        taskGrid: 'slate-tasks-teacher-dashboard slate-studentsgrid',
        courseSelector: 'slate-tasks-teacher-dashboardtoolbar combo'
    },


    // controller templates method overrides
    onLaunch: function () {
        this.getDashboardCt().render('slateapp-viewport');
    },

    viewCourseSection: function(sectionId) {
        var me = this,
            courseSelector = me.getCourseSelector(),
            courseSectionsStore = courseSelector.getStore(),
            // taskGrid = me.getTaskGrid(),
            // studentsStore = taskGrid.getStudentsStore(),
            studentsStore = me.getStudentsStore(),
            studentTasksStore = me.getTasksStore(),
            courseSection = courseSectionsStore.getById(sectionId);

        //select section
        if (!courseSection && courseSectionsStore.isLoaded()) {
            return;
        } else if (!courseSectionsStore.isLoaded()) {
            return courseSectionsStore.load(function() {
                me.viewCourseSection(sectionId);
            });
        }
        if (!(me.getDashboardCt().getCourseSection()) || me.getDashboardCt().getCourseSection().getId() != sectionId) {
            me.getDashboardCt().setCourseSection(courseSection);
        }
        courseSelector.setValue(sectionId);
        studentsStore.loadCount = studentTasksStore.loadCount = 0;
        studentsStore.getProxy().setUrl('/sections/' + sectionId + '/students');
        studentsStore.load({
            callback: me.onStudentsStoreLoad,
            scope: me
        });
        studentTasksStore.getProxy().setUrl('/sections/' + sectionId + '/tasks');
        studentTasksStore.load({
            callback: me.onTasksStoreLoad,
            scope: me
        });
    },


    // event handlers
    onCompetencyRowClick: function(me, competency, ev, targetEl) {
        me.toggleCompetency(competency);
    },

    onCourseSectionSelect: function(combo, record) {
        var me = this;
        me.getDashboardCt().setCourseSection(record);
    },

    onDashboardSectionChange: function(record) {
        this.redirectTo('section/'+record.getId());
    },

    onStudentsStoreLoad: function() {
        this.populateTasksGrid();
    },

    onTasksStoreLoad: function() {
        this.populateTasksGrid();
    },

    onCreateTaskClick: function() {
        var me = this,
            courseSection = me.getDashboardCt().getCourseSection();

        me.getTaskEditor().close();
        return me.editTask(Ext.create('Slate.cbl.model.Task'));
    },

    onEditTaskClick: function() {
        var me = this,
            selection = me.getTasksManager().getSelection()[0];

        if (!selection) {
            return Ext.Msg.alert('Edit Task', 'Nothing selected. Please select a task to edit.');
        }
        return me.editTask(selection);
    },

    onDeleteTaskClick: function() {
        var me = this,
            taskManager = me.getTasksManager(),
            selection = taskManager.getSelection()[0],
            title, message;

        if (selection) {
            title = 'Delete Task';
            message = 'Are you sure you want to delete this task?' + '<br><strong>' + selection.get('Title') + '</strong>';
            return Ext.Msg.confirm(title, message, function(response){
                if (response === 'yes') {
                    return me.deleteTask(selection);
                }
            });
        } else {
            return Ext.Msg.alert('Delete Task', 'Nothing selected. Please select a task to delete.');
        }
    },

    onSaveTaskClick: function() {
        var me = this,
            taskEditor = me.getTaskEditor(),
            studentTask = taskEditor.getStudentTask();
        if (studentTask) {
            studentTask = Ext.create('Slate.cbl.model.StudentTask', studentTask);
            me.getTaskEditorForm().updateRecord(studentTask);

            return me.saveStudentTask(studentTask, function() {
                taskEditor.close();
                Ext.toast('Task saved.');
                me.reloadTasks();
            });
        } else {
            return me.saveTask();
        }
    },

    onEditStudentTask: function(taskGrid, studentTask) {
        var me = this,
            task;

        me.getTasksStore().findBy(function(t) {
            if (t.getId() == studentTask.TaskID) {
                return task = t;
            }

            Ext.each(t.get("SubTasks"), function(st) {
                if (st.ID == studentTask.TaskID) {
                    return task = Ext.create('Slate.cbl.model.Task', st);
                }
            });
        });

        if (task) {
            me.editStudentTask(task, studentTask.StudentID);
        } else {
            //handle failure?
            Ext.Msg.alert('Task not found. Please refresh.');
        }
    },

    onGridDataCellClick: function(taskGrid, target) {
        var me = this,
            taskId = target.getAttribute('data-task-id'),
            parentTaskId = target.getAttribute('data-parent-task-id'),
            studentTaskId = target.getAttribute('data-id'),
            tasksStore = me.getTasksStore(),
            taskRecord = tasksStore.getAt(tasksStore.findBy(function (r) {
                return r.getId() == taskId;
            })),
            studentTask, isLate, date,
            fireEvent = false;

        if (!!parentTaskId && !taskRecord) {
            parentTaskRecord = tasksStore.getById(parentTaskId);
            taskRecord = null;
            Ext.each(parentTaskRecord.get("SubTasks"), function(st) {
                if (st.ID == taskId) {
                    taskRecord = Ext.create('Slate.cbl.model.Task', st);
                }
            });
        }

        if (!taskRecord) { //load task?
            console.log('Task record not found.');
            return;
        }

        Ext.Array.each(taskRecord.get("StudentTasks"), function(st) {
            if (st.ID == studentTaskId) {
                studentTask = st;
            }
        });

        if (studentTask) {
            date = new Date();
            isLate = studentTask.DueDate < (date.getTime() / 1000);
            switch (studentTask.TaskStatus) {
                case 'assigned':
                case 're-assigned':
                    fireEvent = 'editstudenttask';
                    break;
                case 'submitted':
                case 're-submitted':
                    fireEvent = 'ratestudenttask';
                    break;
            }
        } else {
            fireEvent = 'assignstudenttask';
        }

        if (fireEvent) {
            taskGrid.fireEvent(fireEvent, taskGrid, studentTask);
        }
    },

    onAssigneeComboRender: function(combo) {
        var me = this,
            comboStore = combo.getStore(),
            studentsStore = me.getStudentsStore();

        comboStore.removeAll();
        comboStore.add(studentsStore.getRange());
        combo.setValueOnData();
        console.log('updated assignees store');
    },

    onRateStudentTask: function(taskGrid, studentTask) {
        this.rateStudentTask(studentTask);
    },

    onRateSkillClick: function(ratingView, ratingObject) {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        Slate.API.request({
            url: '/cbl/student-tasks/'+studentTask.ID+'/rate',
            method: 'POST',
            params: {
                SkillID: ratingObject.SkillID,
                Score: ratingObject.rating
            },
            callback: function(opts, success, response) {
                if (!success) {
                    Ext.toast('Error. Please try again.');
                }
            }
        });
    },

    onEditStudentTaskClick: function(btn) {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        taskRater.close();
        me.onEditStudentTask(null, studentTask);
    },

    onUnassignStudentTaskClick: function() {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        Ext.Msg.confirm('Are you sure?', 'Do you want to unassign this student task? This can not be undone.', function(ans) {
            if (ans == 'yes') {
                me.unAssignStudentTask(studentTask);
            }
        });

    },

    onAssignRevisionClick: function(btn) {
        var me = this,
            taskRater = me.getTaskRater(),
            coords = btn.getXY();

        if (!btn.dateSelected) {
            return Ext.widget({
                xtype: 'datepicker',
                floating: true,
                handler: function(picker, date) {
                    picker.destroy();
                    btn.dateSelected = date;
                    return btn.setText('Re-Assign revision due on '+Ext.Date.format(date, 'm/d/y'));
                }
            }).showAt(coords[0], coords[1]);
        }

        me.assignStudentTaskRevision(btn.dateSelected);
    },

    onAcceptTaskClick: function() {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = Ext.create('Slate.cbl.model.StudentTask', taskRater.getStudentTask());

        studentTask.set('TaskStatus', 'completed');

        me.saveStudentTask(studentTask, function() {
            taskRater.close();
            me.reloadTasks();
        });
    },

    assignStudentTaskRevision: function(date) {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = Ext.create('Slate.cbl.model.StudentTask', taskRater.getStudentTask());

        studentTask.set('DueDate', date.getTime()/1000);
        studentTask.set('TaskStatus', 're-assigned');
        studentTask.save({
            callback: function(record) {
                me.reloadTasks(function() {
                    taskRater.close();
                    me.rateStudentTask(studentTask.getData());
                });
            }
        });
    },

    unAssignStudentTask: function(studentTask) {
        var me = this;

        Slate.API.request({
            url: '/cbl/student-tasks/'+studentTask.ID+'/delete',
            method: 'POST',
            callback: function(opts, success, response) {
                if (success) {
                    Ext.toast('Student task unassigned.');
                    me.getTaskRater().close();
                    me.reloadTasks();

                }
            }
        });
    },

    rateStudentTask: function(studentTask) {
        var me = this,
            taskRater = me.getTaskRater(),
            task;

        me.getTasksStore().findBy(function(t) {
            if (t.getId() == studentTask.TaskID) {
                return task = t;
            }

            Ext.each(t.get("SubTasks"), function(st) {
                if (st.ID == studentTask.TaskID) {
                    return task = Ext.create('Slate.cbl.model.Task', st);
                }
            });
        });

        if (!task) {
            //handle failure / how can this fail?
            Ext.Msg.alert('Task not found. Please refresh.');
            return;
        }

        Slate.API.request({
            url: '/cbl/student-tasks/'+studentTask.ID,
            method: 'GET',
            params: {
                include: 'Student,SkillRatings'
            },
            callback: function(opts, success, response) {
                // debugger;
                taskRater.setTask(task);
                taskRater.setStudentTask(response.data.data);

                taskRater.show();
            }
        });
    },

    saveStudentTask: function(studentTask, callback, scope) {
        studentTask.save({
            success: function(rec) {
                Ext.toast('Student Task successfully saved!');
                Ext.callback(callback, scope);
            }
        });
    },

    saveTask: function() {
        var me = this,
            form = me.getTaskEditorForm(),
            skillsField = me.getSkillsField(),
            attachmentsField = me.getAttachmentsField(),
            assignmentsField = me.getAssignmentsField(),
            record = form.updateRecord().getRecord(),
            wasPhantom = record.phantom,
            errors;

        //set skills
        record.set('Skills', skillsField.getSkills(false)); // returnRecords
        record.set('Attachments', attachmentsField.getAttachments(false)); // returnRecords
        record.set('Assignees', assignmentsField.getAssignees(false)); // returnRecords
        record.set('CourseSectionID', me.getDashboardCt().getCourseSection().getId());

        errors = record.validate();

        if (errors.length) {
            Ext.each(errors.items, function(item) {
                var itemField = form.down('[name='+item.field +']');
                if (itemField) {
                    itemField.markInvalid(item.message);
                }
            });
            return;
        }

        record.save({
            success: function(rec) {
                me.getTaskEditor().close();

                Ext.toast('Task succesfully saved!');
            }
        });
    },

    editTask: function(taskRecord) {
        var me = this,
            taskEditor = me.getTaskEditor(),
            form = me.getTaskEditorForm();

        if (!taskRecord) {
            taskRecord = Ext.create('Slate.cbl.model.Task');
        }

        taskEditor.setTask(taskRecord);
        taskEditor.setStudentTask(null);
        taskEditor.show();
    },

    editStudentTask: function(taskRecord, studentId) {
        var me = this,
            taskEditor = me.getTaskEditor(),
            form = me.getTaskEditorForm(),
            assignmentsfield = taskEditor.down('slate-tasks-assignmentsfield'),
            assignmentsfieldStore = assignmentsfield.down('combo').getStore(),
            selectedStudents = [], student;

        if (studentId) {
            //load student task data
            Slate.API.request({
                url: '/cbl/student-tasks',
                format: 'GET',
                params: {
                    q: 'student_id:'+studentId + ' task_id:'+taskRecord.getId()
                },
                callback: function(opts, success, request) {
                    var r = request.data.data;

                    if (!success) {
                        return Ext.Msg.alert('Error', 'There was an error loading this task. Please try again.');
                    }
                    taskEditor.setTask(taskRecord);
                    taskEditor.setStudentTask(r[0]);
                    taskEditor.show();
                }
            });
        }

    },

    reloadTasks: function(callback, scope) {
        var me = this,
            store = me.getTasksStore();

        store.reload({
            callback: function() {
                me.populateTasksGrid();
                Ext.callback(callback, scope);
            }
        });
    },

    populateTasksGrid: function() {
        var me = this,
            studentsStore = me.getStudentsStore(),
            tasksStore = me.getTasksStore(),
            taskGrid = me.getTaskGrid();

        if (!studentsStore.isLoaded() || !tasksStore.isLoaded()) {
            return;
        }

        // taskGrid.set();

        taskGrid.setConfig({
            students: studentsStore.getRange(),
            tasks: tasksStore.getRange()
        });

        taskGrid.syncData();
    }
});