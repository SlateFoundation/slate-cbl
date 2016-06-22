Ext.define('SlateTasksManager.view.TaskManagerToolbar', {
    extend: 'Ext.Toolbar',

    xtype: 'slate-tasks-manager-toolbar',

    dock: 'top',
    items: [
        '->',
    {
        text: 'Create',
        action: 'createbtn'
    },{
        text: 'Edit',
        action: 'editbtn'
    },{
        text: 'Delete',
        action: 'deletebtn'
    }]

});