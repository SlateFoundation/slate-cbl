/**
 * The Tasks controller manages the student task list and the task details pop-up.
 */
Ext.define('SlateTasksStudent.controller.Tasks', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.Format',
        'Ext.window.Toast'
    ],


    saveNotificationTitleTpl: [
        '<tpl if="submitting">',
            'Assignment Submitted',
        '<tpl else>',
            'Assignment Saved',
        '</tpl>'
    ],

    saveNotificationBodyTpl: [
        '<tpl if="submitting">',
            'Submitted',
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
        'Tasks',
        'SectionParticipants'
    ],

    models: [
        'StudentTask@Slate.cbl.model.tasks'
    ],


    // component references
    refs: {
        dashboardCt: 'slate-tasks-student-dashboard',

        taskTree: 'slate-tasks-student-tasktree',
        filterMenu: 'slate-tasks-student-tasktree slate-tasks-student-taskfiltersmenu',

        taskWindow: {
            autoCreate: true,

            xtype: 'slate-window',
            closeAction: 'hide',
            modal: true,
            layout: 'fit',
            minWidth: 300,
            width: 600,
            minHeight: 200,

            mainView: {
                xtype: 'slate-cbl-tasks-studenttaskform',
                displayRemovedTasks: false
            }
        },
        formPanel: 'slate-cbl-tasks-studenttaskform',
        saveBtn: 'slate-cbl-tasks-studenttaskform ^ window button[action=save]',
        submitBtn: 'slate-cbl-tasks-studenttaskform ^ window button[action=submit]'
    },

    // entry points
    control: {
        dashboardCt: {
            studentchange: 'onStudentChange',
            sectionchange: 'onSectionChange'
        },
        'slate-tasks-student-tasktree': {
            itemclick: 'onTaskTreeItemClick'
        },
        'slate-tasks-student-taskfiltersmenu menucheckitem': {
            checkchange: 'onFilterItemCheckChange'
        },
        'slate-tasks-student-taskfiltersmenu button#view-all': {
            click: 'onFilterViewAllClick'
        },
        saveBtn: {
            click: 'onSaveClick'
        },
        submitBtn: {
            click: 'onSubmitClick'
        },
        taskTree: {
            render: 'onTaskTreeRender'
        }
    },

    // event handlers
    onTaskTreeRender: function() {
        // filter records when tree renders, due to default filters
        return this.filterRecords();
    },

    onStudentChange: function(dashboardCt, studentUsername) {
        var me = this,
            tasksStore = me.getTasksStore();


        tasksStore.setStudent(studentUsername || '*current');
        me.filterRecords();
    },

    onSectionChange: function(dashboardCt, sectionCode) {
        var me = this,
            tasksStore = me.getTasksStore(),
            menu = me.getFilterMenu(),
            sectionMenuItems = menu.query('[filterGroup=Section]'),
            statusMenuItems = menu.query('[filterGroup=Status]');

        sectionMenuItems.forEach(function(item) {
            if (sectionCode) {
                item.disable().hide();
            } else {
                item.enable().show();
            }
        });

        statusMenuItems.forEach(function(item) {
            if (sectionCode) {
                item.setChecked(
                    item.getValue() !== 'archived'
                );
            } else {
                item.setChecked(
                    [
                        'assigned',
                        're-assigned',
                    ].indexOf(item.getValue()) > -1
                );
            }
        });

        tasksStore.setSection(sectionCode);
        me.filterRecords();
    },

    onTaskTreeItemClick: function(tasksTree, studentTask, itemEl) {
        this.openTaskWindow(studentTask, { animateTarget: itemEl });
    },

    // TODO: use store filters?
    onFilterItemCheckChange: function() {
        this.filterRecords();
    },

    onFilterViewAllClick: function() {
        var me = this,
            menu = me.getFilterMenu(),
            filters = menu.query('menucheckitem'),
            filtersLength = filters.length,
            i = 0,
            checked;

        for (; i < filtersLength; i++) {
          checked = filters[i].filterGroup === 'Status' || filters[i].filterGroup === 'Archive';
          filters[i].setChecked(checked, true);
        }

        me.filterRecords();
        menu.hide();
    },

    onSaveClick: function(saveBtn) {
        this.saveTaskWindow(saveBtn.up('window'));
    },

    onSubmitClick: function(submitBtn) {
        this.saveTaskWindow(submitBtn.up('window'), true);
    },


    // local methods
    openTaskWindow: function(studentTask, options) {
        options = options || {};

        // eslint-disable-next-line vars-on-top
        var me = this,
            StudentTaskModel = me.getStudentTaskModel(),
            formWindow = me.getTaskWindow({
                ownerCmp: me.getDashboardCt()
            }),
            formPanel = formWindow.getMainView();


        // reconfigure form and window
        formWindow.animateTarget = options.animateTarget || null;


        // clear window and show with loading indicator
        formPanel.setStudentTask(null);
        formWindow.show();
        formWindow.setLoading('Loading task&hellip;');


        // fetch Student, Task, and StudentTask data from server
        StudentTaskModel.loadByQuery({
            student: studentTask.get('StudentID'),
            task: studentTask.get('TaskID'),
            include: formPanel.self.modelInclude,
            success: function(loadedStudentTask, operation) {
                loadedStudentTask.readOperationData(operation);
                formPanel.setStudentTask(loadedStudentTask);
                formWindow.setLoading(false);
            },
            failure: function(loadedStudentTask, operation) {
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
        });
    },

    saveTaskWindow: function(formWindow, submitting) {
        var me = this,
            formPanel = formWindow.getMainView(),
            studentTask = formPanel.getRecord();

        formPanel.updateRecord(studentTask);

        if (submitting) {
            studentTask.set('TaskStatus', 'submitting');
        }

        // ensure studentTask doesn't become dirty when no changes are made to the form
        if (!studentTask.dirty) {
            return;
        }

        formWindow.setLoading((submitting ? 'Submitting' : 'Saving') + ' assignment&hellip;');

        studentTask.save({
            include: formPanel.self.modelInclude,
            success: function(savedStudentTask, operation) {
                var studentTasksStore = me.getTasksStore(),
                    tplData = {
                        submitting: Boolean(submitting),
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

    // TODO: use store filters?
    filterRecords: function() {
        var me = this,
            menu = me.getFilterMenu(),
            sectionFilters = menu.query('menucheckitem[filterGroup=Section][checked]{isDisabled() === false}'),
            statusFilters = menu.query('menucheckitem[filterGroup=Status][checked]'),
            timelineFilters = menu.query('menucheckitem[filterGroup=Timeline][checked]'),
            archivedTaskFilter = menu.down('menucheckitem[filterGroup=Archive]'),
            includeArchivedTasks = archivedTaskFilter && archivedTaskFilter.checked,
            store = me.getTasksStore(),
            statuses = [],
            timelines = [],
            sections = [];

        // set status filters
        statusFilters.forEach(function(filter) {
            statuses = statuses.concat(
                Array.isArray(filter.getValue()) ?
                    filter.getValue() :
                    [filter.getValue()]
            );
        });
        store.setStatusFilter(statuses);

        // set timeline filters
        timelineFilters.forEach(function(filter) {
            timelines.push(filter.getValue());
        });
        store.setTimelineFilter(timelines);

        sectionFilters.forEach(function(filter) {
            sections.push(filter.getValue());
        });
        store.setSectionFilter(sections);

        store.getProxy().setExtraParam('include_archived', includeArchivedTasks);
        store.getProxy().setExtraParam('include_filtered_parent_tasks', true);

        store.loadIfDirty();
    }
});
