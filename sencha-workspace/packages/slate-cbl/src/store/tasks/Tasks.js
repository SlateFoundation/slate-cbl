Ext.define('Slate.cbl.store.tasks.Tasks', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-tasks',


    model: 'Slate.cbl.model.tasks.Task',
    config: {
        section: null,

        remoteFilter: true,
        remoteSort: true,
        pageSize: 0,

        // redeclare identical proxy as model for dynamic reconfiguration
        proxy: 'slate-cbl-tasks'
    },


    // model lifecycle
    constructor: function() {
        this.callParent(arguments);
        this.dirty = true;
    },

    loadRecords: function() {
        var me = this,
            subTasksByParent = {},
            count, index, task, parentTaskId,
            subTasks, subTasksLength, subTaskIndex, taskData;

        me.callParent(arguments);

        me.beginUpdate();

        // decorate Task records with SubTasks arrays and ParentTask references
        count = me.getCount();

        for (index = 0; index < count; index++) {
            task = me.getAt(index);
            parentTaskId = task.get('ParentTaskID');

            if (!parentTaskId) {
                continue;
            }

            if (parentTaskId in subTasksByParent) {
                subTasksByParent[parentTaskId].push(task);
            } else {
                subTasksByParent[parentTaskId] = [task];
            }
        }

        for (index = 0; index < count; index++) {
            task = me.getAt(index);
            taskData = task.getData();
            subTasks = subTasksByParent[task.getId()] || [];
            subTasksLength = subTasks.length;
            subTaskIndex = 0;

            task.set('SubTasks', subTasks, { dirty: false });

            for (; subTaskIndex < subTasksLength; subTaskIndex++) {
                subTasks[subTaskIndex].set('ParentTask', taskData, { dirty: false });
            }
        }
        me.endUpdate();
    },


    // config handlers
    updateSection: function(section) {
        this.getProxy().setExtraParam('course_section', section || null);
        this.dirty = true;
    },


    // member methods
    loadIfDirty: function() {
        if (!this.dirty) {
            return;
        }

        this.dirty = false;
        this.load();
    },

    unload: function() {
        this.loadCount = 0;
        this.removeAll();
    }
});