Ext.define('SlateTasksManager.view.TaskManagerToolbar', {
    extend: 'Ext.Toolbar',

    xtype: 'slate-tasks-manager-toolbar',

    dock: 'top',
    items: [
        '->',
    {
        text: 'Create',
        reference: 'createbtn'
    },{
        text: 'Edit',
        reference: 'editbtn'
    },{
        text: 'Delete',
        reference: 'deletebtn'
    }]

});