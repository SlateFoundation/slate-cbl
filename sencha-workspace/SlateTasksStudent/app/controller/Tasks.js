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
                xtype: 'slate-cbl-tasks-studenttaskform'
            }
        },
        formPanel: 'slate-cbl-tasks-studenttaskform',
        saveBtn: 'slate-cbl-tasks-studenttaskform ^ window button[action=save]',
        submitBtn: 'slate-cbl-tasks-studenttaskform ^ window button[action=submit]'
    },

    listen: {
        controller: {
            '#': {
                bootstrapdataload: 'onBootstrapDataLoad'
            }
        },
        store: {
            '#Tasks': {
                load: 'onTasksLoad'
            },
            '#SectionParticipants': {
                load: 'onSectionParticipantsLoad'
            }
        }
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
    onStudentChange: function(dashboardCt, studentUsername) {
        var tasksStore = this.getTasksStore(),
            sectionParticipantsStore = this.getSectionParticipantsStore();

        tasksStore.setStudent(studentUsername || '*current');
        sectionParticipantsStore.setStudent(studentUsername || '*current');

        tasksStore.loadIfDirty();
        sectionParticipantsStore.loadIfDirty();
    },

    onBootstrapDataLoad: function(app, bootstrapData) {
        var menu = this.getFilterMenu(),
            currentYearTermIds = bootstrapData.currentYearTermIds;

        // show and load student selector for privileged users
        if (currentYearTermIds) {
            menu.setCurrentYearTermIds(currentYearTermIds);
            }
    },

    onSectionParticipantsLoad: function(store) {
        var me = this,
            menu = me.getFilterMenu(),
            now = new Date(),
            currentlyEnrolledSectionIds = [];

        // get "current" enrollments
        store.getRange().forEach(function(enrollment) {

            if (
                ( // enrollment/term start date is earlier than current date or null
                    (
                        enrollment.get('StartDate') &&
                        enrollment.get('StartDate') <= now
                    ) ||
                    (
                        enrollment.get('StartDate') === null &&
                        (
                            enrollment.get('Section')['TermID'] === null ||
                            enrollment.get('Section')['Term']['StartDate'] === null ||
                            new Date(enrollment.get('Section')['Term']['StartDate']) <= now
                        )
                    )
                ) &&
                (
                    (
                        enrollment.get('EndDate') &&
                        enrollment.get('EndDate') >= now
                    ) ||
                    (
                        enrollment.get('EndDate') === null &&
                        (
                            enrollment.get('Section')['TermID'] === null ||
                            enrollment.get('Section')['Term']['EndDate'] === null ||
                            new Date(enrollment.get('Section')['Term']['EndDate']) >= now
                        )
                    )
                )
            ) {
                currentlyEnrolledSectionIds.push(enrollment.get('CourseSectionID'));
            }
        });

        menu.setCurrentlyEnrolledSectionIds(currentlyEnrolledSectionIds);
        me.filterRecords();
    },

    onTasksLoad: function(store) {
        // this.filterRecords();
    },

    onTaskTreeRender: function() {
        // filter records when tree renders, due to default filters
        return this.filterRecords();
    },

    onSectionChange: function(dashboardCt, sectionCode) {
        var me = this,
            tasksStore = me.getTasksStore(),
            menu = me.getFilterMenu(),
            sectionMenuItems = menu.query('[filterGroup=Section]');

        sectionMenuItems.forEach(function(item) {
            if (sectionCode) {
                item.disable().hide();
            } else {
                item.enable().show();
            }
        });

        tasksStore.setSection(sectionCode);
        tasksStore.loadIfDirty();
    },

    onTaskTreeItemClick: function(tasksTree, studentTask, itemEl) {
        this.openTaskWindow(studentTask, { animateTarget: itemEl });
    },

    // TODO: audit and optimize
    // TODO: use store filters?
    onFilterItemCheckChange: function() {
        this.filterRecords();
    },

    // TODO: audit and optimize
    onFilterViewAllClick: function() {
        var me = this,
            menu = me.getFilterMenu(),
            checkedFilters = menu.query('menucheckitem[checked]'),
            checkedFiltersLength = checkedFilters.length,
            store = this.getTasksStore(),
            recs = store.getRange(),
            recLength = recs.length,
            i = 0;

        for (; i < checkedFiltersLength; i++) {
            checkedFilters[i].setChecked(false, true);
        }

        for (i = 0; i < recLength; i++) {
            recs[i].set('filtered', false);
        }

        me.getTaskTree().refresh();
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
        StudentTaskModel.load({
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

    filterRecords: function() {
        var me = this,
            menu = me.getFilterMenu(),
            sectionFilters = menu.query('menucheckitem[filterGroup=Section][checked]{isDisabled() === false}'),
            statusFilters = menu.query('menucheckitem[filterGroup=Status][checked]'),
            timelineFilters = menu.query('menucheckitem[filterGroup=Timeline][checked]'),
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

        store.loadIfDirty();
    },


    /**
     * Passes a record through a group of filters.
     * @param {Ext.data.Model} rec- The record to be tested.
     * @param {Array} filterGroup - An array of objects with a filter function.
     * @param {boolean} intersectFilters - Set this to true to have filters intersect.
     * @returns {boolean} filtered - true if this rec should be filtered
     */
    // TODO: audit and optimize
    filterRecord: function(rec, filterGroup, intersectFilters) {
        var menu = this.getFilterMenu(),
            filterGroupLength = filterGroup.length,
            filtered = filterGroupLength !== 0, // if no filters, return false
            i = 0;

        for (; i < filterGroupLength; i++) {
            if (intersectFilters === true) {
                if (i === 0) {
                    filtered = false;
                } else if (filtered === true) {
                    break;
                }
                filtered = filtered || filterGroup[i].filterFn(rec, menu);
            } else {
                filtered = filtered && filterGroup[i].filterFn(rec, menu);
            }
        }

        return filtered;
    }
});