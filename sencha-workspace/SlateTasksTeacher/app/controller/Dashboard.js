/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('SlateTasksTeacher.controller.Dashboard', {
    extend: 'Ext.app.Controller',


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
        'TaskEditor'
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

    onCourseSectionSelect: function(combo, record) {
        var me = this;
        me.getDashboardCt().setCourseSection(record);
    },

    onDashboardSectionChange: function(record) {
        this.redirectTo('section/'+record.get('Code'));
    },

    // event handlers
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

    assignStudentTask: function(studentTask) {

    }
});