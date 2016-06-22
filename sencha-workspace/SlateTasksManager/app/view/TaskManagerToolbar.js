Ext.define('SlateTasksManager.view.TaskManagerToolbar', {
    extend: 'Ext.Toolbar',

    xtype: 'slate-tasks-manager-toolbar',

    dock: 'top',
    items: [
        '->',
    {
        text: 'Create',
        action: 'create'
    },{
        text: 'Edit',
        action: 'edit'
    },{
        text: 'Delete',
        action: 'delete'
    }]

});