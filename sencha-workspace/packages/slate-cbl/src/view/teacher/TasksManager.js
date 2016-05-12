Ext.define('Slate.cbl.view.teacher.TasksManager', {
    extend: 'Ext.grid.GridPanel',
    xtype: 'slate-tasksmanager',
    requires:[
    ],

    config: {
    },

    title: 'Task Database',

    componentCls: 'slate-tasksmanager',

    store: {
        fields: ['title', 'parent', 'type', 'skills', 'year', 'creator', 'created'],
        data: [
            { title: 'Examination of Historical Egypt', parent: 'Mesopotamian Geography',   type: 'Studio', skills: ['HIS.1', 'HS.1', 'HIS.2', 'HS.2'], year: 'Y2', creator: 'Thomas Gaffney',  created: '2015-04-03' }
        ]
    },

    columns: {
        items: [
            { text: 'Title',                dataIndex: 'title',     flex: 1     },
            { text: 'Subtask of&hellip;',   dataIndex: 'parent',    flex: 1     },
            { text: 'Type of Exp.',         dataIndex: 'type',      width: 128  },
            { text: 'Skills',               dataIndex: 'skills',    flex: 1     },
            { text: 'Year',                 dataIndex: 'year',      width: 64   },
            { text: 'Created by',           dataIndex: 'creator',   width: 160  },
            { text: 'Created',              dataIndex: 'created',   width: 128  },
        ]
    }
});