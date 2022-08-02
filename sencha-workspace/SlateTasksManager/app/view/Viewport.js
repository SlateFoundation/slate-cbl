Ext.define('SlateTasksManager.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'SlateTasksManager.view.TasksManager'
    ],

    layout: 'fit',
    items: [{
        xtype: 'slate-tasks-manager'
    }]
});
