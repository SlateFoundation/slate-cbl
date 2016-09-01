/* eslint new-cap: 0 */
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
                beforeload: 'onStudentTasksStoreBeforeLoad',
                load: 'onStudentTasksStoreLoad'
            }
        }
    },


    // event handlers
    onStudentTasksStoreBeforeLoad: function() {
        this.getTaskTree().mask('Loading Tasks');
    },

    onStudentTasksStoreLoad: function(store) {
        this.displayTaskData(store.getRange(), true);
    },

    onTaskTreeItemClick: function(id) {
        var me = this,
            rec = me.getStudentTasksStore().getById(id),
            details = me.getTaskDetails(),
            form = me.getTaskForm(),
            ratingView = me.getRatingView(),
            teacherAttachmentsField = me.getTeacherAttachmentsField(),
            studentAttachmentsField = me.getStudentAttachmentsField(),
            commentsField = me.getCommentsField(),
            readonly = me.getTaskTree().getReadOnly() || rec.get('TaskStatus') === 'completed';

        form.getForm().loadRecord(rec);

        // TODO: quick fix, but needs a new field or expanded workflow tracking
        if (rec.get('TaskStatus') === 're-submitted') {
            form.down('displayfield[name="Submitted"]').setFieldLabel('Resubmitted Date');
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
    },

    onSubmitButtonClick: function() {
        var me = this,
            form = me.getTaskForm(),
            attachmentsField = me.getStudentAttachmentsField(),
            record = form.getRecord();

        record.set('Attachments', attachmentsField.getAttachments(false)); // returnRecords

        record.save({
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
            menu = me.getFilterMenu(),
            statusFilters = menu.query('menucheckitem[filterGroup=Status][checked]'),
            timelineFilters = menu.query('menucheckitem[filterGroup=Timeline][checked]'),
            store = me.getStudentTasksStore(),
            recs = store.getRange(),
            recLength = recs.length,
            i = 0,
            rec;

        for (; i < recLength; i++) {
            rec = recs[i];
            rec.set('filtered', me.filterRecord(rec, statusFilters) || me.filterRecord(rec, timelineFilters));
        }

        me.displayTaskData(store.getRange());

    },

    onFilterViewAllClick: function() {
        var me = this,
            menu = me.getFilterMenu(),
            checkedFilters = menu.query('menucheckitem[checked]'),
            checkedFiltersLength = checkedFilters.length,
            store = this.getStudentTasksStore(),
            recs = store.getRange(),
            recLength = recs.length,
            i = 0;

        for (; i < checkedFiltersLength; i++) {
            checkedFilters[i].setChecked(false, true);
        }

        for (i = 0; i < recLength; i++) {
            recs[i].set('filtered', false);
        }

        me.displayTaskData(store.getRange());
    },

    onTaskTreeCourseSectionChange: function(taskTree, courseSectionId) {
        var student = taskTree.getStudent(),
            params = {};

        if (courseSectionId) {
            params.course_section = courseSectionId;  // eslint-disable-line camelcase
        }

        if (student) {
            params.student = student;
        }

        this.getStudentTasksStore().load({
            params: params
        });
    },


    // custom controller methods
    displayTaskData: function(recs) {
        var me = this,
            tree = me.getTaskTree(),
            tasks;

        tasks = me.formatTaskData(recs);
        tree.update({ tasks: tasks });
        tree.unmask();
    },

    formatTaskData: function(recs) {
        var me = this,
            parentRecs = me.getParentRecs(recs),
            parentRecsLength = parentRecs.length,
            parentRec,
            tasks = [],
            task,
            subTasks,
            i = 0;

        for (; i<parentRecsLength; i++) {
            parentRec = parentRecs[i];
            task = parentRec.getData();
            subTasks = me.getSubTasks(recs, task.TaskID);

            if (subTasks.length > 0) {
                task.subtasks = subTasks;
                parentRec.set('filtered', false); // do not filter parent tasks that have unfiltered subtasks
            }
            if (!parentRec.get('filtered')) {
                tasks.push(task);
            }
        }

        return tasks;
    },

    getParentRecs: function(recs) {
        var recsLength = recs.length,
            parentRecs = [],
            i = 0,
            rec;

        for (; i<recsLength; i++) {
            rec = recs[i];
            if (rec.get('ParentTaskID') === null) {
                parentRecs.push(rec);
            }
        }

        return parentRecs;
    },

    getSubTasks: function(recs, parentId) {
        var recsLength = recs.length,
            i = 0,
            subTasks = [],
            rec;

        for (; i<recsLength; i++) {
            rec = recs[i];
            if (rec.get('ParentTaskID') === parentId && !rec.get('filtered')) {
                rec.set('ParentTaskTitle', rec.get('Task').ParentTask.Title);
                subTasks.push(rec.getData());
            }
        }

        return subTasks;
    },

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
    }

});
