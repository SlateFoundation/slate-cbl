/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.controller.Tasks', {
    extend: 'Ext.app.Controller',


    // entry points
    control: {
        'slate-tasktree': {
            render: 'onTaskTreeRender',
            itemclick: 'onTaskTreeItemClick'
        },
        ratingView: {
            afterrender: 'onRatingViewAfterRender'
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
        taskForm: 'slate-taskdetails slate-modalform',
        parentTaskField: 'slate-modalform field[name="ParentTaskTitle"]',
        ratingView: 'slate-modalform slate-ratingview'
    },


    // event handlers
    onTaskTreeRender: function() {
        this.getStudentTasksStore().load();
    },

    onStudentTasksStoreLoad: function(store) {
        var me = this,
            tree = me.getTaskTree(),
            tasks = me.formatTaskData(store.getRange());

        tree.update({tasks: tasks});
    },

    onTaskTreeItemClick: function(id) {
        var me = this,
            rec = me.getStudentTasksStore().getById(id),
            details = me.getTaskDetails(),
            form = me.getTaskForm(),
            ratingView = me.getRatingView(),
            parentTaskField = me.getParentTaskField();

        form.getForm().loadRecord(rec);

        ratingView.setData({
            ratings: [ 7, 8, 9, 10, 11, 12, 'M' ],
            //competencies: rec.get('Competencies')
            competencies: [
                {
                    code: 'ELA.2',
                    desc: 'Reading Informational Texts',
                    skills: [
                        {
                            code: 'ELA.2.HS.1',
                            desc: 'Cite evidence',
                            level: 9,
                            rating: 10
                        },
                        {
                            code: 'ELA.2.HS.3',
                            desc: 'Analyze developments',
                            level: 11
                        }
                    ]
                },
                {
                    code: 'ELA.3',
                    desc: 'Writing Evidence-Based Arguments',
                    skills: [
                        {
                            code: 'ELA.3.HS.2',
                            desc: 'Use evidence to develop claims and counterclaims',
                            level: 9,
                            rating: 8
                        }
                    ]
                }
            ]
        });
        me.hideRatingViewElements(ratingView);

        parentTaskField.setVisible(rec.get('ParentTaskID') !== null);

        details.show();
    },

    onRatingViewAfterRender: function(view) {
        this.hideRatingViewElements(view);
    },


    // custom controller methods
    formatTaskData: function(recs) {
        var me = this,
            tasks = me.getParentTasks(recs),
            tasksLength = tasks.length,
            task,
            subTasks,
            i = 0;

        for (; i<tasksLength; i++) {
            task = tasks[i];
            subTasks = me.getSubTasks(recs, task.TaskID);
            if (subTasks.length > 0) {
                task.subtasks = subTasks;
            }
        }

        return tasks;
    },

    getParentTasks: function(recs) {
        var recsLength = recs.length,
            parentRecs = [],
            i = 0,
            rec;

        for (; i<recsLength; i++) {
            rec = recs[i];
            if (rec.get('ParentTaskID') === null) {
                parentRecs.push(rec.getData());
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
            if (rec.get('ParentTaskID') === parentId) {
                rec.set('ParentTaskTitle',rec.get('Task').ParentTask.Title);
                subTasks.push(rec.getData());
            }
        }

        return subTasks;
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
    }

});
