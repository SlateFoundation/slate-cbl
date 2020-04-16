Ext.define('SlateTasksManager.store.ParentTasks', {
    extend: 'Ext.data.ChainedStore',

    config: {
        source: 'Tasks'
    },
});