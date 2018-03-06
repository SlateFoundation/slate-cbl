/**
 * The StudentTasks controller manages the loading, creation, opening, and editing of student-tasks
 *
 * ## Responsibilities
 * -
 */
Ext.define('SlateTasksTeacher.controller.StudentTasks', {
    extend: 'Ext.app.Controller',


    // dependencies
    views: [
        'Window@Slate.ui',
        'StudentTaskForm@Slate.cbl.view.tasks'
    ],

    stores: [
        'StudentTasks',
        'SectionParticipants'
    ],

    models: [
        'StudentTask@Slate.cbl.model.tasks'
    ],


    // component factories and selectors
    refs: {
        dashboardCt: 'slate-tasks-teacher-dashboard',
        studentsGrid: 'slate-studentsgrid',

        studentTaskWindow: {
            autoCreate: true,

            xtype: 'slate-window',
            closeAction: 'hide',
            modal: true,
            layout: 'fit',
            minWidth: 300,
            width: 600,
            minHeight: 600,

            mainView: {
                xtype: 'slate-cbl-tasks-studenttaskform'
            }
        },
        formPanel: 'slate-cbl-tasks-studenttaskform'
    },


    // entry points
    control: {
        dashboardCt: {
            selectedsectionchange: 'onSelectedSectionChange'
        },
        studentsGrid: {
            cellclick: 'onCellClick',
            subcellclick: 'onCellClick'
        }
    },


    // event handlers
    onSelectedSectionChange: function(dashboardCt, sectionCode) {
        var me = this,
            studentTasksStore = me.getStudentTasksStore();

        // (re)load StudentTask list
        studentTasksStore.setSection(sectionCode);
        studentTasksStore.loadIfDirty(true);
    },

    onCellClick: function(grid, taskId, participantId, cellEl) {
        var me = this,
            studentTasksStore = me.getStudentTasksStore(),
            studentId = me.getSectionParticipantsStore().getById(participantId).get('PersonID'),
            studentTask = studentTasksStore.getAt(studentTasksStore.findBy(function(r) {
                return r.get('TaskID') == taskId && r.get('StudentID') == studentId;
            }));

        if (!studentTask) {
            studentTask = {
                StudentID: studentId,
                TaskID: taskId
            };
        }

        me.openStudentTaskWindow({
            animateTarget: cellEl,
            studentTask: studentTask
        });
    },


    // local methods
    openStudentTaskWindow: function(options) {
        options = options || {};

        // eslint-disable-next-line vars-on-top
        var me = this,
            StudentTaskModel = me.getStudentTaskModel(),
            formWindow = me.getStudentTaskWindow({
                ownerCmp: me.getDashboardCt()
            }),
            formPanel = formWindow.getMainView(),
            studentTask = options.studentTask;


        // reconfigure form and window
        formWindow.animateTarget = options.animateTarget || null;


        // prepare selected model
        if (typeof studentTask == 'number') {
            // fetch from server and show window asynchronously
            formPanel.setTitle(null);
            formPanel.hide();
            formWindow.show();
            formWindow.setLoading('Loading student task&hellip;');

            StudentTaskModel.load(studentTask, {
                success: function(loadedStudentTask) {
                    formPanel.setTask(loadedStudentTask);
                    formPanel.show();
                    formWindow.setLoading(false);
                },
                failure: function(loadedStudentTask, operation) {
                    formWindow.hide();
                    formWindow.setLoading(false);

                    Ext.Msg.show({
                        title: 'Failed to load student task #'+studentTask,
                        message: operation.getError(),
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            });

            return;
        } else if (!studentTask || (typeof studentTask == 'object' && !studentTask.isModel)) {
            // create from data object
            studentTask = StudentTaskModel.create(Ext.apply({}, studentTask || null));
        } else if (!(studentTask instanceof StudentTaskModel)) {
            Ext.Logger.error('Invalid studentTask option');
            return;
        }


        // show window with phantom or provided task
        formPanel.setStudentTask(studentTask);
        formWindow.show();
    }
});