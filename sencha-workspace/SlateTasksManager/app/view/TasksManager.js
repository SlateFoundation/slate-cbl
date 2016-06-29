Ext.define('SlateTasksManager.view.TasksManager', {
    extend: 'Ext.grid.GridPanel',
    xtype: 'slate-tasks-manager',
    requires:[
        'SlateTasksManager.view.TaskDetails',
        'SlateTasksManager.view.TaskManagerToolbar',
        'Slate.cbl.store.Tasks',
		'Ext.saki.grid.MultiSearch'
    ],

    config: {
    },

    title: 'Task Database',
    header: false,

    componentCls: 'slate-tasks-manager',

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
            xtype: 'slate-tasks-manager-toolbar'
        }
    ],

	plugins: [
		{
			ptype: 'saki-gms',
			pluginId: 'gms',
            iconColumn: false
		}
	],

    columns: {
        defaults: {
            filterField: {
                xtype: 'textfield',
                triggers: {
                    search: {
                        cls: 'x-form-search-trigger'
                    }
                }
            },
            flex: 1
        },
        items: [
            {
                text: 'Title',
                dataIndex: 'Title'
            },
            {
                text: 'Subtask of&hellip;',
                dataIndex: 'ParentTaskTitle'
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
                    '<tpl for="skills" between=", ">{.}</tpl>'
                ]
            },
            {
                text: 'Year',
                dataIndex: 'Year',
                width: 70
            },
            {
                text: 'Created by',
                dataIndex: 'CreatorFullName',
                width: 160
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