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
            editstudenttask: 'onEditStudentTask'
            // ratestudenttask: 'onRateStudentTask'
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
        'TaskEditor'
    ],

    stores: [
        'StudentTasks',
        'Students',
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
            studentTasksStore = me.getStudentTasksStore(),
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
            callback: me.onStudentTasksStoreLoad,
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

    onStudentTasksStoreLoad: function() {
        this.populateTasksGrid();
    },

    onCreateTaskClick: function() {
        var me = this,
            courseSection = me.getDashboardCt().getCourseSection();

        return me.editTask(Ext.create('Slate.cbl.model.Task', {
            ContextClass: courseSection.get('Class'),
            ContextID: courseSection.getId()
        }));
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
        return this.saveTask();
    },

    onEditStudentTask: function(taskGrid, studentTask) {
        var me = this,
            task = me.getStudentTasksStore().getById(studentTask.TaskID);


        if (!task) {
            me.getStudentTasksStore().findBy(function(t) {
                Ext.each(t.get("SubTasks"), function(st) {
                    if (st.ID == studentTask.TaskID) {
                        task = Ext.create('Slate.cbl.model.Task', st);
                    }
                });
            });
        }
        me.editStudentTask(task, studentTask.StudentID);
    },

    onGridDataCellClick: function(taskGrid, target) {
        var me = this,
            taskId = target.getAttribute('data-task-id'),
            parentTaskId = target.getAttribute('data-parent-task-id'),
            studentTaskId = target.getAttribute('data-id'),
            tasksStore = me.getStudentTasksStore(),
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

    saveStudentTask: function() {
        var me = this,
            form = me.getTaskEditorForm(),
            taskEditor = me.getTaskEditor(),
            task = taskEditor.getTask(),
            studentTask = taskEditor.getStudentTask(),
            record = Ext.create('Slate.cbl.model.StudentTask', studentTask);

        form.updateRecord(record);

        record.save({
            success: function(rec) {
                taskEditor.close();
                Ext.toast('Student Task successfully saved!');
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
            // if ((student = me.getStudentsStore().getById(studentId))) {
            //     selectedStudents.push(student);
            // }

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

    populateTasksGrid: function() {
        var me = this,
            studentsStore = me.getStudentsStore(),
            tasksStore = me.getStudentTasksStore(),
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