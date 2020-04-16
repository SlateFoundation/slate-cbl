Ext.define('SlateTasksManager.view.AppHeader', {
    extend: 'Slate.ui.app.Header',

    xtype: 'slate-tasks-manager-appheader',

    items: [{
        xtype: 'component',
        cls: 'slate-appheader-title',
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
        tooltip: 'Edit Task'
    },{
        iconCls: 'x-fa fa-trash-o',
        action: 'delete',
        tooltip: 'Delete Task'
    }]

});