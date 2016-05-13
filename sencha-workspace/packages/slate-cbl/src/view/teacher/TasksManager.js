Ext.define('Slate.cbl.view.teacher.TasksManager', {
    extend: 'Ext.grid.GridPanel',
    xtype: 'slate-tasksmanager',
    requires:[
        'Slate.cbl.view.teacher.TaskDetails'
    ],

    config: {
    },

    title: 'Task Database',
    header: false,

    componentCls: 'slate-tasksmanager',

    dockedItems: [
        {
            xtype: 'pagingtoolbar',
            dock: 'bottom'
        },
        {
            xtype: 'slate-taskdetails',
            dock: 'right',
            width: 240
        }
    ],

    columns: {
        items: [
            { text: 'Title',                dataIndex: 'title',     flex: 1     },
            { text: 'Subtask of&hellip;',   dataIndex: 'parent',    flex: 1     },
            { text: 'Type of Exp.',         dataIndex: 'type',      width: 128  },
            { text: 'Skills',               dataIndex: 'skills',    flex: 1     },
            { text: 'Year',                 dataIndex: 'year',      width: 64   },
            { text: 'Created by',           dataIndex: 'creator',   width: 160  },
            { text: 'Created',              dataIndex: 'created',   width: 128  }
        ]
    },

    store: {
        fields: ['title', 'parent', 'type', 'skills', 'year', 'creator', 'created'],
        data: [
            {
                title: 'Title of Task',
                parent: 'Subtask Title',
                type: 'Workshop',
                skills: ['HIS.1', 'HS.1', 'HIS.2', 'HS.2'],
                year: 'Y2',
                creator: 'Chris Alfano',
                created: '2015-03-12'
            },
            {
                title: 'Title of Task',
                parent: 'Mesopotamian Geography',
                type: 'Studio',
                skills: ['HIS.1', 'HS.1', 'HIS.2', 'HS.2'],
                year: 'Y2',
                creator: 'Thomas Gaffney',
                created: '2015-04-03'
            },
            {
                title: 'Title of Task',
                parent: 'Subtask Title',
                type: 'Workshop',
                skills: ['HIS.1', 'HS.1', 'HIS.2', 'HS.2'],
                year: 'Y2',
                creator: 'Chris Alfano',
                created: '2015-03-13'
            },
            {
                title: 'Title of Task',
                parent: 'Mesopotamian Geography',
                type: 'Studio',
                skills: ['HIS.1', 'HS.1', 'HIS.2', 'HS.2'],
                year: 'Y2',
                creator: 'Thomas Gaffney',
                created: '2015-04-04'
            },
            {
                title: 'Title of Task',
                parent: 'Subtask Title',
                type: 'Workshop',
                skills: ['HIS.1', 'HS.1', 'HIS.2', 'HS.2'],
                year: 'Y2',
                creator: 'Chris Alfano',
                created: '2015-03-14'
            },
            {
                title: 'Title of Task',
                parent: 'Mesopotamian Geography',
                type: 'Studio',
                skills: ['HIS.1', 'HS.1', 'HIS.2', 'HS.2'],
                year: 'Y2',
                creator: 'Thomas Gaffney',
                created: '2015-04-06'
            },
            {
                title: 'Title of Task',
                parent: 'Subtask Title',
                type: 'Mythbusters',
                skills: ['HIS.1', 'HS.1', 'HIS.2', 'HS.2'],
                year: 'Y2',
                creator: 'Chris Alfano',
                created: '2015-03-17'
            },
            {
                title: 'Title of Task',
                parent: 'Mesopotamian Geography',
                type: 'Studio',
                skills: ['HIS.1', 'HS.1', 'HIS.2', 'HS.2'],
                year: 'Y2',
                creator: 'Thomas Gaffney',
                created: '2015-04-08'
            },
            {
                title: 'Title of Task',
                parent: 'Subtask Title',
                type: 'Workshop',
                skills: ['HIS.1', 'HS.1', 'HIS.2', 'HS.2'],
                year: 'Y2',
                creator: 'Chris Alfano',
                created: '2015-03-18'
            },
            {
                title: 'Title of Task',
                parent: 'Mesopotamian Geography',
                type: 'Studio',
                skills: ['HIS.1', 'HS.1', 'HIS.2', 'HS.2'],
                year: 'Y2',
                creator: 'Thomas Gaffney',
                created: '2015-04-10'
            },
        ]
    }
});