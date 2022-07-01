Ext.define('SlateTasksManager.view.AppHeader', {
    extend: 'Slate.ui.app.Header',

    xtype: 'slate-tasks-manager-appheader',
    padding: '16 90 16 90',

    items: [{
        xtype: 'component',
        cls: 'slate-apptitle',
        itemId: 'title',
        html: 'Task Library'
    },
        '->',
    {
        cls: 'primary',
        iconCls: 'x-fa fa-plus',
        action: 'create',
        tooltip: 'Create Task'
    },{
        iconCls: 'x-fa fa-pencil',
        action: 'edit',
        tooltip: 'Edit Task',
        disabled: true
    },{
        iconCls: 'x-fa fa-trash-o',
        action: 'delete',
        tooltip: 'Delete Task',
        disabled: true
    }]
});