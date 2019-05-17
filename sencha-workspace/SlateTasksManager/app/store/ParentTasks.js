Ext.define('SlateTasksManager.store.ParentTasks', {
    extend: 'Ext.data.ChainedStore',

    config: {
        source: 'Tasks',
        filters: [
            item => item.data.ParentTaskID === null
        ]
    },
});