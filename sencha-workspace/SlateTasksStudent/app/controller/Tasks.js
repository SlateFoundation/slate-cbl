/* global Slate *//* eslint new-cap: 0 */
/**
 * The Tasks controller manages the student task list and the task details pop-up.
 */
Ext.define('SlateTasksStudent.controller.Tasks', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.Toast'
    ],


    // dependencies
    views: [
        'TaskTree',
        'TaskDetails',
        'TaskFilters'
    ],

    models: [
        'StudentTask'
    ],

    stores: [
        'StudentTasks'
    ],


    // component references
    refs: {
        taskTree: {
            selector: 'slatetasksstudent-tasktree',
            autoCreate: true,

            xtype: 'slatetasksstudent-tasktree'
        },
        taskDetails: {
            selector: 'slate-taskdetails',
            autoCreate: true,

            xtype: 'slate-taskdetails'
        },
        filterMenu: 'button#filter menu',
        taskForm: 'slate-taskdetails slate-modalform',
        parentTaskField: 'slate-modalform field[name="ParentTaskTitle"]',
        ratingView: 'slate-modalform slate-ratingview',
        taskAttachmentsList: 'slate-modalform slate-attachmentslist#task-attachments',
        commentsField: 'slate-commentsfield',
        teacherAttachmentsField: 'slate-tasks-attachmentsfield#teacher-attachments',
        studentAttachmentsField: 'slate-tasks-attachmentsfield#student-attachments',
        // attachmentsTextField: 'slate-tasks-attachmentsfield textfield',
        // addLinkButton: 'slate-tasks-attachmentsfield button[action=addlink]',
        // addAttachmentButton: 'slate-tasks-attachmentsfield button[action=addattachment]',
        submitButton: 'slate-taskdetails button#submit'
    },


    // entry points
    control: {
        'slatetasksstudent-tasktree': {
            itemclick: 'onTaskTreeItemClick',
            coursesectionchange: 'onTaskTreeCourseSectionChange'
        },
        submitButton: {
            click: 'onSubmitButtonClick'
        },
        'button#filter menucheckitem': {
            checkchange: 'onFilterItemCheckChange'
        },
        'button#filter button#view-all': {
            click: 'onFilterViewAllClick'
        }
    },

    listen: {
        store: {
            '#StudentTasks': {
                load: 'onStudentTasksStoreLoad'
            }
        }
    },


    // event handlers
    onStudentTasksStoreLoad: function(store) {
        var me = this,
            tree = me.getTaskTree();

        tree.update(store.getRange());
    },

    onTaskTreeItemClick: function(id) {
        var me = this,
            rec = new SlateTasksStudent.model.StudentTask({ ID: id });

        rec.load({
            params: {
                ID: id
            },
            callback: function(record, op, success) {
                if (success) {
                    me.showDetails(record);
                } else {
                    Ext.toast('Unable to load task');
                }
            }
        });
    },

    onSubmitButtonClick: function() {
        var me = this,
            form = me.getTaskForm(),
            attachmentsField = me.getStudentAttachmentsField(),
            record = form.getRecord();

        Slate.API.request({
            url: Slate.API.buildUrl('/cbl/student-tasks/submit'),
            jsonData: {
                ID: record.get('ID'),
                Attachments: attachmentsField.getAttachments(false)
            },
            success: function() {
                Ext.toast('Task successfully submitted!');
                me.getStudentTasksStore().reload();
                me.getTaskDetails().close();
            },
            failure: function() {
                Ext.toast('Task could not be submitted.');
            }
        });
    },

    onFilterItemCheckChange: function() {
        var me = this,
            tree = me.getTaskTree(),
            menu = me.getFilterMenu(),
            statusFilters = menu.query('menucheckitem[filterGroup=Status][checked]'),
            timelineFilters = menu.query('menucheckitem[filterGroup=Timeline][checked]'),
            store = me.getStudentTasksStore(),
            recs, recLength, i = 0, rec;

        store.clearFilter();
        recs = store.getRange();
        recLength = recs.length;

        for (; i < recLength; i++) {
            rec = recs[i];
            rec.set('filtered', me.filterRecord(rec, statusFilters) || me.filterRecord(rec, timelineFilters));
        }

        store.filter('filtered', false);

        tree.update(store.getRange());

    },

    onFilterViewAllClick: function() {
        var me = this,
            tree = me.getTaskTree(),
            menu = me.getFilterMenu(),
            checkedFilters = menu.query('menucheckitem[checked]'),
            checkedFiltersLength = checkedFilters.length,
            store = this.getStudentTasksStore(),
            recs, recLength, i = 0;

        for (; i < checkedFiltersLength; i++) {
            checkedFilters[i].setChecked(false, true);
        }

        store.clearFilter();
        recs = store.getRange();
        recLength = recs.length;

        for (i = 0; i < recLength; i++) {
            recs[i].set('filtered', true);
        }

        tree.update(store.getRange());
    },

    onTaskTreeCourseSectionChange: function(taskTree, courseSectionId) {
        var params = {};

        if (courseSectionId) {
            params = {
                'course_section': courseSectionId
            }
        }

        this.getStudentTasksStore().load({
            params: params
        });
    },


    // custom controller methods
    /**
     * Passes a record through a group of filters.
     * @param {Ext.data.Model} rec- The record to be tested.
     * @param {Array} filterGroup - An array of objects with a filter function.
     * @returns {boolean} filtered - true if this rec should be filtered
     */
    filterRecord: function(rec, filterGroup) {
        var filterGroupLength = filterGroup.length,
            filtered = filterGroupLength !== 0,  // if no filters, return false
            i = 0;

        for (; i < filterGroupLength; i++) {
            filtered = filtered && filterGroup[i].filterFn(rec);
        }

        return filtered;
    },

    showDetails: function(rec) {
        var me = this,
            details = me.getTaskDetails(),
            form = me.getTaskForm(),
            ratingView = me.getRatingView(),
            teacherAttachmentsField = me.getTeacherAttachmentsField(),
            studentAttachmentsField = me.getStudentAttachmentsField(),
            commentsField = me.getCommentsField(),
            submissions = rec.get('Submissions'),
            readonly = me.getTaskTree().getReadOnly() || rec.get('TaskStatus') === 'completed';

        form.getForm().loadRecord(rec);

        if (submissions && submissions.length && submissions.length > 0) {
            form.down('displayfield[name="Submitted"]').hide();
            form.down('displayfield[name="Submissions"]').show();
        } else {
            form.down('displayfield[name="Submitted"]').show();
            form.down('displayfield[name="Submissions"]').hide();
        }

        ratingView.setData({
            ratings: [7, 8, 9, 10, 11, 12, 'M'],
            competencies: rec.getTaskSkillsGroupedByCompetency()
        });

        me.getParentTaskField().setVisible(rec.get('ParentTaskID') !== null);
        teacherAttachmentsField.setAttachments(rec.get('Task').Attachments);
        teacherAttachmentsField.setReadOnly(true);
        commentsField.setRecord(rec);
        commentsField.setReadOnly(true);

        studentAttachmentsField.setAttachments(rec.Attachments().getRange());
        studentAttachmentsField.setReadOnly(readonly);

        me.getSubmitButton().setDisabled(readonly);

        details.show();


    }


});
