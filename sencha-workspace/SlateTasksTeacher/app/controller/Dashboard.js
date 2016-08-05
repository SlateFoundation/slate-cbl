/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('SlateTasksTeacher.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.Toast'
    ],

    // entry points
    control: {
        courseSelector: {
            select: 'onCourseSectionSelect'
        },
        dashboardCt: {
            coursesectionselect: 'onDashboardSectionChange'
        },
        tasksGrid: {
            cellclick: 'onTasksGridCellClick'
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
        'slate-tasks-teacher-taskassigner button[action=assign]': {
            click: 'onAssignTaskClick'
        },
        'slate-tasks-teacher-taskeditor button[action=save]': {
            click: 'onSaveTaskClick'
        }
    },

    routes: {
        'section/:sectionId': {
            sectionId: '([a-zA-Z0-9])+',
            action: 'viewCourseSection'
        }
    },


    // controller configuration
    views: [
        'Dashboard',
        'TaskEditor',
        'TaskRater',
        'TaskAssigner'
    ],
    stores: [
        'CourseSections',
        'Students',
        'StudentTasks',
        'Tasks'
    ],
    refs: {
        dashboardCt: {
            selector: 'slate-tasks-teacher-dashboard',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-dashboard'
        },
        tasksGrid: {
            selector: 'slate-studentsgrid',
            autoCreate: true,

            xtype: 'slate-studentsgrid'
        },
        taskAssigner: {
            selector: 'slate-tasks-teacher-taskassigner',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-taskassigner'
        },
        taskRater: {
            selector: 'slate-tasks-teacher-taskrater',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-taskrater'
        },
        taskEditor: {
            selector: 'slate-tasks-teacher-taskeditor',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-taskeditor'
        },
        taskEditorForm: 'slate-tasks-teacher-taskeditor slate-modalform',
        assignmentsComboField: 'slate-tasks-teacher-taskeditor slate-tasks-assignmentsfield combo',

        courseSelector: 'slate-tasks-teacher-appheader combo'
    },

    // controller templates method overrides
    onLaunch: function () {
        this.getDashboardCt().render('slateapp-viewport');
    },

    // event handlers
    onCourseSectionSelect: function(combo, record) {
        var me = this;
        me.getDashboardCt().setCourseSection(record);
    },

    onDashboardSectionChange: function(record) {
        this.redirectTo('section/'+record.get('Code'));
    },

    onAcceptTaskClick: function() {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        studentTask.set('TaskStatus', 'completed');

        me.saveStudentTask(studentTask, function() {
            taskRater.close();
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

    onEditStudentTaskClick: function(btn) {
        var me = this,
            taskRater = me.getTaskRater(),
            task = taskRater.getTask(),
            studentTask = taskRater.getStudentTask();

        taskRater.close();
        me.editStudentTask(studentTask);
    },

    onStudentsStoreLoad: function() {
        console.log('onstudentstoreload', arguments);
    },

    onAssigneeComboRender: function(combo) {
        var me = this,
            comboStore = combo.getStore(),
            studentsStore = me.getStudentsStore();

        comboStore.removeAll();
        comboStore.add(studentsStore.getRange());
        combo.setValueOnData();
        console.log('students updated');
    },

    onTasksGridCellClick: function(grid, taskId, studentId, cellEl, evt) {
        var me = this,
            dataStore = grid.getDataStore(),
            studentTask = dataStore.getAt(dataStore.findBy(function(r) {
                return r.get('TaskID') == taskId && r.get('StudentID') == studentId;
            })),
            date = new Date(), isLate;

        if (studentTask) {
            switch (studentTask.get('TaskStatus')) {
                case 'assigned':
                case 're-assigned':
                    return me.editStudentTask(studentTask);
                case 'submitted':
                case 're-submitted':
                    return me.rateStudentTask(studentTask);
            }
        } else {
            return me.assignStudentTask(taskId, studentId);
        }
    },

    onRateSkillClick: function(ratingView, ratingObject) {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        Slate.API.request({
            url: '/cbl/student-tasks/'+studentTask.getId()+'/rate',
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

    onAssignTaskClick: function() {
        var me = this,
            taskAssigner = me.getTaskAssigner(),
            taskAssignerValues = taskAssigner.down('slate-modalform').getValues(),
            task = taskAssigner.getTask(),
            student = taskAssigner.getStudent(),
            studentTask = Ext.create('Slate.cbl.model.StudentTask', {
                TaskID: task.getId(),
                StudentID: student.getId(),
                DueDate: taskAssignerValues.DueDate,
                ExpirationDate: taskAssignerValues.ExpirationDate,
                ExperienceType: taskAssignerValues.ExperienceType,
                CourseSectionID: me.getCourseSelector().getSelection().getId()
            });

        me.saveStudentTask(studentTask, function(rec) {
            taskAssigner.close();
            me.getTasksGrid().getDataStore().add(rec);
            Ext.toast(student.getFullName() + ' was assigned task: ' + task.get('Title'));
        });

    },

    onSaveTaskClick: function() {
        var me = this,
            taskEditor = me.getTaskEditor(),
            studentTask = taskEditor.getStudentTask();
        if (studentTask) {
            me.getTaskEditorForm().updateRecord(studentTask);

            return me.saveStudentTask(studentTask, function() {
                taskEditor.close();
                Ext.toast('Student task successfully updated.');
            });
        } else {
            // return me.saveTask();
        }
    },

    //
    viewCourseSection: function(sectionCode) {
        var me = this,
            courseSelector = me.getCourseSelector(),
            courseSectionsStore = courseSelector.getStore(),
            studentsStore = me.getStudentsStore(),
            tasksStore = me.getTasksStore(),
            studentTasksStore = me.getStudentTasksStore(),
            courseSection = courseSectionsStore.findRecord('Code', sectionCode);

        //select section
        if (!courseSection && courseSectionsStore.isLoaded()) {
            console.log('Course Section not found.');
            return;
        } else if (!courseSectionsStore.isLoaded()) {
            return courseSectionsStore.load(function() {
                me.viewCourseSection(sectionCode);
            });
        }
        if (!(me.getDashboardCt().getCourseSection()) || me.getDashboardCt().getCourseSection().getId() != sectionCode) {
            me.getDashboardCt().setCourseSection(courseSection);
        }
        courseSelector.setValue(courseSectionsStore.findRecord('Code', sectionCode));

        //update store urls
        studentsStore.setCourseSection(sectionCode).load();
        tasksStore.setCourseSection(sectionCode).load();
        studentTasksStore.setCourseSection(sectionCode).load();
    },

    assignStudentTaskRevision: function(date) {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        studentTask.set('DueDate', date.getTime()/1000);
        studentTask.set('TaskStatus', 're-assigned');
        studentTask.save({
            callback: function(record) {
                taskRater.close();
                Ext.toast('Student task successfully updated.');
                me.rateStudentTask(studentTask);
            }
        });
    },

    unAssignStudentTask: function(studentTask) {
        var me = this;

        studentTask.erase({
            callback: function(opts, success, response) {
                if (success) {
                    Ext.toast('Student task unassigned.');
                    me.getTaskRater().close();
                }
            }
        });
    },

    saveStudentTask: function(studentTask, callback, scope) {
        studentTask.save({
            success: function(rec) {
                Ext.callback(callback, scope, [rec]);
            }
        });
    },

    editStudentTask: function(studentTask) {
        var me = this,
            grid = me.getTasksGrid(),
            taskEditor = me.getTaskEditor(),
            form = me.getTaskEditorForm(),
            task = grid.getRowsStore().getById(studentTask.get('TaskID'));

        if (!task || !studentTask) { //is this likely?
            return Ext.Msg.error('Error', 'Unable to find task. Please refresh the page and try again.'); // is this optimal?
        }

        taskEditor.setTask(task);
        taskEditor.setStudentTask(studentTask);
        taskEditor.show();

    },

    rateStudentTask: function(studentTask) {
        var me = this,
            taskRater = me.getTaskRater(),
            task = me.getTasksStore().getById(studentTask.get('TaskID'));

        //handle failure
        if (!task) {
            // how can this fail?
            Ext.Msg.alert('Task not found. Please refresh.');
            return;
        }

        taskRater.setTask(task);
        taskRater.setStudentTask(studentTask);

        taskRater.show();
    },

    assignStudentTask: function(taskId, studentId) {
        var me = this,
            taskAssigner = me.getTaskAssigner(),
            student = me.getStudentsStore().getById(studentId),
            task = me.getTasksStore().getById(taskId);

        if (!task) {
            //handle failure / how can this fail?
            Ext.Msg.alert('Task not found. Please refresh.');
            return;
        }

        taskAssigner.setStudent(student);
        taskAssigner.setTask(task);
        taskAssigner.show();
    }
});