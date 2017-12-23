Ext.define('Slate.cbl.store.tasks.Tasks', {
    extend: 'Ext.data.Store',


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
            childTasks = {},
            count, index, task, parentTaskId;

        me.callParent(arguments);

        // decorate Task records with ChildTasks arrays
        count = me.getCount();

        for (index = 0; index < count; index++) {
            task = me.getAt(index);
            parentTaskId = task.get('ParentTaskID');

            if (!parentTaskId) {
                continue;
            }

            if (parentTaskId in childTasks) {
                childTasks[parentTaskId].push(task);
            } else {
                childTasks[parentTaskId] = [task];
            }
        }

        for (index = 0; index < count; index++) {
            task = me.getAt(index);
            task.set('ChildTasks', childTasks[task.getId()] || []);
        }
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