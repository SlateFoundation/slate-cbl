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
        }
    },


    // event handlers
    onTaskTreeRender: function() {
        this.getStudentTasksStore().load();
    },

    onTaskTreeItemClick: function(id) {
        var me = this,
            store = me.getStudentTasksStore(),
            rec = store.getById(id),
            details = me.getTaskDetails();

        console.log('id: ' +rec.get('ID'));
        console.log('id: ' +rec.get('Title'));
        console.log(rec);
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
