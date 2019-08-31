Ext.define('Slate.cbl.store.tasks.StudentTasks', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-studenttasks',


    model: 'Slate.cbl.model.tasks.StudentTask',
    config: {
        section: null,
        student: null,

        remoteFilter: true,
        remoteSort: true,
        pageSize: 0,

        // redeclare identical proxy as model for dynamic reconfiguration
        proxy: 'slate-cbl-studenttasks',
    },


    constructor: function() {
        this.callParent(arguments);
        this.dirty = true;
    },


    // config handlers
    updateSection: function(section) {
        this.getProxy().setExtraParam('course_section', section || null);
        this.dirty = true;
    },

    updateStudent: function(student) {
        this.getProxy().setExtraParam('student', student || null);
        this.dirty = true;
    },


    // member methods
    loadIfDirty: function(clearBeforeLoad) {
        var me = this;

        if (!me.dirty) {
            return;
        }

        me.dirty = false;

        if (clearBeforeLoad) {
            me.unload();
        }

        me.load();
    },

    unload: function() {
        this.loadCount = 0;
        this.removeAll();
    },

    mergeTasks: function(tasks) {
        var me = this,
            taskIndex = 0, tasksLength = tasks.length,
            task, taskId, taskData, studentTasks, studentTaskIds,
            studentTaskIndex, studentTasksLength,
            _filterRemoved = function(studentTask) {
                return (
                    studentTask.get('TaskID') == taskId
                    && studentTaskIds.indexOf(studentTask.getId()) == -1
                );
            };

        // pause change propagation on StudentTasks store
        me.beginUpdate();

        for (; taskIndex < tasksLength; taskIndex++) {
            task = tasks[taskIndex];
            taskId = task.getId();
            taskData = task.getData();

            // merge associated student tasks into StudentTasks store and remove any that have been deleted
            studentTasks = task.get('StudentTasks') || [];
            me.mergeData(studentTasks);

            // remove any StudentTask records that are associated with the updated task but missing from new list
            studentTaskIds = Ext.Array.pluck(studentTasks, 'ID');
            me.remove(me.queryBy(_filterRemoved).getRange());


            // update task data embedded in any associated StudentTask records
            studentTasks = me.queryRecords('TaskID', taskId);
            studentTaskIndex = 0;
            studentTasksLength = studentTasks.length;

            for (; studentTaskIndex < studentTasksLength; studentTaskIndex++) {
                studentTasks[studentTaskIndex].set('Task', taskData, { dirty: false });
            }
        }

        // propagate all changes to StudentTasks store
        me.endUpdate();
    }
});
