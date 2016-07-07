/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.controller.Tasks', {
    extend: 'Ext.app.Controller',


    // entry points
    control: {
        'slate-tasktree': {
            render: 'onTaskTreeActivate'
        }
    },

    listen: {
        store: {
            '#Tasks': {
                load: 'onTasksStoreLoad'
            }
        }
    },


    // controller configuration
    views: [
        'TaskTree'
    ],

    stores: [
        'Tasks'
    ],

    refs: {
        taskTree: {
            selector: 'slate-tasktree',
            autoCreate: true,

            xtype: 'slate-tasktree'
        }
    },


    // event handlers
    onTaskTreeActivate: function() {
        this.getTasksStore().load();
    },

    onTasksStoreLoad: function(store) {
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
            subTasks = me.getSubTasks(recs, task.ID);
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
                subTasks.push(rec.getData());
            }
        }

        return subTasks;
    }

});
