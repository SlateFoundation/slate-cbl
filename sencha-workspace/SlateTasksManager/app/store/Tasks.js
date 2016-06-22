Ext.define('SlateTasksManager.store.Tasks', {
    extend: 'Ext.data.Store',
    requires: [
        'SlateTasksManager.model.Task'
    ],

    model: 'SlateTasksManager.model.Task',
    autoLoad: true,
    remoteFilter: true,
    remoteSort: true
});