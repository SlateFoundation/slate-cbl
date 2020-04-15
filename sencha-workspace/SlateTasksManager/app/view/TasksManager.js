Ext.define('SlateTasksManager.view.TasksManager', {
    extend: 'Ext.grid.GridPanel',
    xtype: 'slate-tasks-manager',
    requires: [
        'SlateTasksManager.view.AppHeader',
        'SlateTasksManager.view.TaskDetails'
    ],


    title: 'Task Library',
    header: false,

    componentCls: 'slate-tasks-manager',
    minHeight: 500,

    dockedItems: [
        {
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            store: 'Tasks'
        },
        {
            xtype: 'slate-tasks-manager-details',
            dock: 'right',
            width: 240
        },
        {
            xtype: 'slate-tasks-manager-appheader'
        }
    ],

    columns: {
        defaults: {
            flex: 1
        },
        items: [
            {
                text: 'Title',
                dataIndex: 'Title'
            },
            {
                text: 'Subtask of&hellip;',
                dataIndex: 'ParentTask',
                xtype: 'templatecolumn',
                tpl: [
                    '<tpl for="ParentTask">{Title}</tpl>'
                ]
            },
            {
                text: 'Type of Exp.',
                dataIndex: 'ExperienceType',
                width: 128
            },
            {
                text: 'Skills',
                dataIndex: 'Skills',
                xtype: 'templatecolumn',
                tpl: [
                    '<tpl for="Skills">{.}</tpl>'
                ]
            },
            {
                text: 'Created by',
                dataIndex: 'Creator',
                width: 160,
                xtype: 'templatecolumn',
                tpl: [
                    '<tpl for="Creator">{FirstName} {LastName}</tpl>'
                ]
            },
            {
                text: 'Created',
                dataIndex: 'Created',
                width: 128,
                xtype: 'datecolumn',
                format: 'm-d-Y',
                filterField: {
                    xtype: 'datefield',
                    submitFormat: 'Y-m-d'
                }
            }
        ]
    },

    store: 'Tasks'
});