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
            align: 'center'
        },
        items: [
            {
                text: 'Title',
                dataIndex: 'Title',
                flex: 3,
                align: 'left'
          },
            {
                text: 'Subtask of&hellip;',
                flex: 2,
                dataIndex: 'ParentTask',
                xtype: 'templatecolumn',
                align: 'left',
                tpl: [
                    '<tpl for="ParentTask">{Title}</tpl>'
                ]
            },
            {
                text: 'Type of Exp.',
                dataIndex: 'ExperienceType',
                width: 120
            },
            {
                text: 'Skills',
                dataIndex: 'Skills',
                flex: 1,
                xtype: 'templatecolumn',
                tpl: [
                    '<tpl for="Skills">{.}</tpl>'
                ]
            },
            {
                text: 'Created by',
                dataIndex: 'Creator',
                flex: 1,
                xtype: 'templatecolumn',
                tpl: [
                    '<tpl for="Creator">{FirstName} {LastName}</tpl>'
                ]
            },
            {
                text: 'Created',
                dataIndex: 'Created',
                width: 120,
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