/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.controller.Tasks', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.Toast'
    ],

    // entry points
    control: {
        'slate-tasktree': {
            render: 'onTaskTreeRender',
            itemclick: 'onTaskTreeItemClick'
        },
        ratingView: {
            afterrender: 'onRatingViewAfterRender'
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


    // controller configuration
    views: [
        'TaskTree',
        'TaskDetails'
    ],

    stores: [
        'StudentTasks'
    ],

    refs: {
        taskTree: {
            selector: 'slate-tasktree',
            autoCreate: true,

            xtype: 'slate-tasktree'
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
        comments: 'slate-modalform #comments',
        attachmentsField: 'slate-modalform slate-tasks-attachmentsfield',
        attachmentsTextField: 'slate-tasks-attachmentsfield textfield',
        addLinkButton: 'slate-tasks-attachmentsfield button[action=addlink]',
        addAttachmentButton: 'slate-tasks-attachmentsfield button[action=addattachment]',
        submitButton: 'slate-taskdetails button#submit'
    },


    // event handlers
    onTaskTreeRender: function() {
        this.getStudentTasksStore().load();
    },

    onStudentTasksStoreLoad: function(store) {
        var me = this,
            tree = me.getTaskTree(),
            tasks = me.formatTaskData(store.getRange());

        me.formatCompetencies(store);
        tree.update({tasks: tasks});
    },

    onTaskTreeItemClick: function(id) {
        var me = this,
            rec = me.getStudentTasksStore().getById(id),
            details = me.getTaskDetails(),
            form = me.getTaskForm(),
            ratingView = me.getRatingView(),
            readonly = (rec.get('TaskStatus') === 'completed');

        form.getForm().loadRecord(rec);

        ratingView.setData({
            ratings: [ 7, 8, 9, 10, 11, 12, 'M' ],
            competencies: rec.get('Competencies')
        });

        me.hideRatingViewElements(ratingView);

        me.getParentTaskField().setVisible(rec.get('ParentTaskID') !== null);

        me.getTaskAttachmentsList().getStore().setData(rec.TaskAttachments().getRange());

        me.getComments().setData(me.formatCommentData(rec.Comments().getRange()));

        me.getAttachmentsField().setAttachments(rec.Attachments().getRange());

        me.getAttachmentsTextField().setDisabled(readonly);
        me.getAddLinkButton().setDisabled(readonly);
        //me.getAddAttachmentButton().setDisabled(readonly);  //TODO: uncomment when attachments implemented

        me.getSubmitButton().setDisabled(readonly);

        details.show();
    },

    onRatingViewAfterRender: function(view) {
        this.hideRatingViewElements(view);
    },

    onSubmitButtonClick: function() {
        var me = this,
            form = me.getTaskForm(),
            attachmentsField = me.getAttachmentsField();

        record = form.getRecord();

        record.set('Attachments', attachmentsField.getAttachments(false)); // returnRecords

        record.save({
            success: function() {
                Ext.toast('Task successfully submitted!');
                me.getStudentTasksStore().load();
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
            store = this.getStudentTasksStore(),
            recs = store.getRange(),
            recLength = recs.length,
            i = 0,
            rec;

        for (; i < recLength; i++) {
            rec = recs[i];
            rec.set('filtered', me.filterRecord(rec, statusFilters) || me.filterRecord(rec, timelineFilters));
        }

        me.getTaskTree().update({tasks: me.formatTaskData(store.getRange())});

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

        me.getTaskTree().update({tasks: me.formatTaskData(store.getRange())});
    },


    // custom controller methods
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
                parentRec.set('filtered',false); // do not filter parent tasks that have unfiltered subtasks
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
                rec.set('ParentTaskTitle',rec.get('Task').ParentTask.Title);
                subTasks.push(rec.getData());
            }
        }

        return subTasks;
    },

    /*
     * Group skills by Competency for each task.
     * Task Object has Skills, Skills have a Competency, but we wish to group skills by Competency
     */
    formatCompetencies: function(store) {
        var recs = store.getRange(),
            recsLength = recs.length,
            skill,
            skills,
            skillsLength,
            competencies = {},
            i = 0, j;

        for (; i<recsLength; i++) {
            rec = recs[i];

            skills = rec.Skills().getRange();
            skillsLength = skills.length;

            // Index competencies by ID, filtering out duplicates
            for (j=0; j<skillsLength; j++) {
                skill = skills[j];
                competencies[skill.get('CompetencyID')] = Ext.apply({Skills:[]}, skill.get('Competency'));
            }

            // Assign skills to their competency
            for (j=0; j<skillsLength; j++) {
                skill = skills[j];
                competencies[skill.get('CompetencyID')].Skills.push(skill.getData());
            }

            rec.set('Competencies',Ext.Object.getValues(competencies));
        }
    },


    /* TODO: hiding elements that don't need to be in student view, but maybe we should do a
     * custom component instead
     */
    hideRatingViewElements: function(view) {
        var viewEl = view.getEl();

        if (viewEl) {
            Ext.each(viewEl.query('button.slate-ratingview-remove',false), function(el) {
                el.hide();
            });
            Ext.each(viewEl.query('li.slate-ratingview-rating-null',false), function(el) {
                el.hide();
            });
        }
    },

    formatCommentData: function(recs) {
        var recsLength = recs.length,
            comments = [],
            i = 0;

        for (; i<recsLength; i++) {
            comments.push(recs[i].getData());
        }

        return {comments: comments};
    },

    /**
     * Passes a record through a group of filters.
     * @param {Ext.data.Model} rec- The record to be tested.
     * @param {Array} filterGroup - An array of objects with a filter function.
     * @returns {boolean} filtered - true if this rec should be filtered
     */
    filterRecord: function(rec, filterGroup) {
        var filterGroupLength = filterGroup.length,
            filtered = filterGroupLength === 0 ? false : true,  // if no filters, return false
            i = 0;

        for (; i < filterGroupLength; i++) {
            filtered = filtered && filterGroup[i].filterFn(rec);
        }

        return filtered;
    }

});
