Ext.define('SlateTasksManager.view.AppHeader', {
    extend: 'Slate.ui.app.Header',

    xtype: 'slate-tasks-manager-appheader',
    padding: '16 90 16 90',

    layout: 'hbox',

    items: [{
        xtype: 'component',
        cls: 'slate-apptitle',
        itemId: 'title',
        html: 'Task Library',
        flex: 1
    },{
        xtype: 'checkbox',
        name : 'include-archived',
        value: false,
        boxLabel: 'include archived',
        flex: 1
    },{
        xtype: 'container',
        flex: 1,
        align: 'right',
        defaults: {
            xtype: 'button',
            margin: '0 20px 0 0',
            cls: 'primary'
        },
        items: [{
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
    }]

});