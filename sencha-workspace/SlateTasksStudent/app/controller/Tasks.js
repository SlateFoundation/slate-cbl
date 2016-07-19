/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.controller.Tasks', {
    extend: 'Ext.app.Controller',


    // entry points
    control: {
        'slate-tasktree': {
            render: 'onTaskTreeRender',
            itemclick: 'onTaskTreeItemClick'
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
        parentTaskField: 'slate-modalform field[name="ParentTask"]',
        ratingView: 'slate-modalform slate-ratingview'
    },


    // event handlers
    onTaskTreeRender: function() {
        this.getStudentTasksStore().load();
    },

    onTaskTreeItemClick: function(id) {
        var me = this,
            rec = me.getStudentTasksStore().getById(id),
            details = me.getTaskDetails(),
            form = me.getTaskForm(),
            parentTaskField = me.getParentTaskField();
            ratingView = me.getRatingView();

        form.getForm().setValues(rec.getData());

        ratingView.setData(rec.get('Competencies'));

        parentTaskField.setVisible(rec.get('ParentTaskID') !== null);

        details.show();
    },

    onStudentTasksStoreLoad: function(store) {
        var me = this,
            recs = store.getRange(),
            tree = me.getTaskTree(),
            tasks = me.formatTaskData(recs);

        tree.update({tasks: tasks});
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
                subTasks.push(Ext.apply(rec.getData()));
            }
        }

        return subTasks;
    }

});
