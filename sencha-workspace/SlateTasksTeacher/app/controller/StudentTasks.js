/**
 * The StudentTasks controller manages the loading, creation, opening, and editing of student-tasks
 *
 * ## Responsibilities
 * -
 */
Ext.define('SlateTasksTeacher.controller.StudentTasks', {
    extend: 'Ext.app.Controller',
    requires: [
        'Jarvus.override.data.RequireLoadedStores',
        'Ext.util.Format',
        'Ext.window.Toast',
        'Ext.window.MessageBox'
    ],


    saveNotificationTitleTpl: [
        '<tpl if="wasPhantom">',
            'Assignment Created',
        '<tpl else>',
            'Assignment Saved',
        '</tpl>'
    ],

    saveNotificationBodyTpl: [
        '<tpl if="wasPhantom">',
            'Created',
        '<tpl else>',
            'Saved',
        '</tpl>',
        ' assignment of ',
        '<tpl for="studentTask">',
            '<tpl for="Task">',
                '<strong>{Title}</strong>',
            '</tpl>',
            ' for ',
            '<tpl for="Student">',
                '<strong>{FirstName} {LastName}</strong>',
            '</tpl>',
        '</tpl>'
    ],


    // dependencies
    views: [
        'Window@Slate.ui',
        'StudentTaskForm@Slate.cbl.view.tasks'
    ],

    stores: [
        'StudentTasks',
        'Tasks',
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
            minHeight: 200,

            mainView: {
                xtype: 'slate-cbl-tasks-studenttaskform'
            }
        },
        formPanel: 'slate-cbl-tasks-studenttaskform',
        saveBtn: 'slate-cbl-tasks-studenttaskform ^ window button[action=save]'
    },


    // entry points
    listen: {
        store: {
            '#StudentTasks': {
                load: 'onStudentTasksLoad'
            },
            '#Tasks': {
                add: 'onTaskAdd',
                update: 'onTaskUpdate'
            }
        }
    },

    control: {
        dashboardCt: {
            selectedsectionchange: 'onSelectedSectionChange'
        },
        studentsGrid: {
            cellclick: 'onCellClick',
            subcellclick: 'onCellClick'
        },
        saveBtn: {
            click: 'onSaveClick'
        }
    },


    // event handlers
    onStudentTasksLoad: function(store, records, success) {
        if (!success) {
            return;
        }

        // eslint-disable-next-line vars-on-top
        var participantsStore = this.getSectionParticipantsStore(),
            tasksStore = this.getTasksStore(),
            recordsLength = records.length,
            recordIndex = 0, record, studentId, participant, taskData, parentTaskId, parentTask;

        // decorate StudentTask models with Student and ParentTask data
        Ext.StoreMgr.requireLoaded([participantsStore, tasksStore], function() {
            store.beginUpdate();

            for (; recordIndex < recordsLength; recordIndex++) {
                record = records[recordIndex];

                if (!record.get('Student') && (studentId = record.get('StudentID'))) {
                    participant = participantsStore.getByPersonId(studentId);
                    record.set('Student', participant && participant.get('Person') || null, { dirty: false });
                }

                if (
                    !record.get('ParentTask')
                    && (taskData = record.get('Task'))
                ) {
                    parentTaskId = taskData.ParentTaskID;
                    parentTask = parentTaskId && tasksStore.getById(parentTaskId);
                    record.set('ParentTask', parentTask ? parentTask.getData() : null, { dirty: false });
                }
            }

            store.endUpdate();
        });
    },

    onTaskAdd: function(tasksStore, tasks) {
        this.getStudentTasksStore().mergeTasks(tasks);
    },

    onTaskUpdate: function(tasksStore, task, operation, modifiedFieldNames) {
        if (operation != 'edit' || modifiedFieldNames.indexOf('StudentTasks') == -1) {
            return;
        }

        this.getStudentTasksStore().mergeTasks([task]);
    },

    onSelectedSectionChange: function(dashboardCt, sectionCode) {
        var me = this,
            studentTasksStore = me.getStudentTasksStore();

        // (re)load StudentTask list
        studentTasksStore.setSection(sectionCode);
        studentTasksStore.loadIfDirty(true);
    },

    onCellClick: function(grid, taskId, participantId, cellEl) {
        var studentId = this.getSectionParticipantsStore().getById(participantId).get('PersonID');

        this.openStudentTaskWindow(studentId, taskId, { animateTarget: cellEl });
    },

    onSaveClick: function(saveBtn) {
        var me = this,
            formWindow = saveBtn.up('window'),
            formPanel = formWindow.getMainView(),
            studentTask = formPanel.getRecord(),
            wasPhantom = studentTask.phantom;

        formPanel.updateRecord(studentTask);

        // ensure studentTask doesn't become dirty when no changes are made to the form
        if (!studentTask.dirty) {
            return;
        }

        formWindow.setLoading('Saving assignment&hellip;');

        studentTask.save({
            include: formPanel.self.modelInclude,
            success: function(savedStudentTask, operation) {
                var studentTasksStore = me.getStudentTasksStore(),
                    tplData = {
                        wasPhantom: wasPhantom,
                        studentTask: savedStudentTask.getData()
                    };

                // show notification to user
                Ext.toast(
                    Ext.XTemplate.getTpl(me, 'saveNotificationBodyTpl').apply(tplData),
                    Ext.XTemplate.getTpl(me, 'saveNotificationTitleTpl').apply(tplData)
                );

                savedStudentTask.readOperationData(operation);

                // update loaded tasks data
                studentTasksStore.mergeData([savedStudentTask]);

                // close window
                formWindow.hide();
                formWindow.setLoading(false);
            },
            failure: function(savedTask, operation) {
                formWindow.setLoading(false);

                Ext.Msg.show({
                    title: 'Failed to save student task',
                    message: Ext.util.Format.htmlEncode(operation.getError()),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },


    // local methods
    openStudentTaskWindow: function(studentId, taskId, options) {
        options = options || {};

        // eslint-disable-next-line vars-on-top
        var me = this,
            StudentTaskModel = me.getStudentTaskModel(),
            formWindow = me.getStudentTaskWindow({
                ownerCmp: me.getDashboardCt()
            }),
            formPanel = formWindow.getMainView();


        // reconfigure form and window
        formWindow.animateTarget = options.animateTarget || null;


        // clear window and show with loading indicator
        formPanel.setStudentTask(null);
        formWindow.show();
        formWindow.setLoading('Loading student task&hellip;');


        // fetch Student, Task, and StudentTask data from server
        StudentTaskModel.load({
            student: studentId,
            task: taskId,
            include: formPanel.self.modelInclude,
            success: function(loadedStudentTask, operation) {
                loadedStudentTask.readOperationData(operation);
                formPanel.setStudentTask(loadedStudentTask);
                formWindow.setLoading(false);
            },
            failure: function(loadedStudentTask, operation) {
                if (operation.wasSuccessful()) {
                    // request was successful but no record was found, initialize phantom
                    loadedStudentTask.readOperationData(operation, {
                        availableActions: {
                            create: true,
                            rate: true
                        }
                    });
                    formPanel.setStudentTask(loadedStudentTask);
                    formWindow.setLoading(false);
                } else {
                    // request failed
                    formWindow.hide();
                    formWindow.setLoading(false);

                    Ext.Msg.show({
                        title: 'Failed to load student task',
                        message: operation.getError(),
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            }
        });
    }
});