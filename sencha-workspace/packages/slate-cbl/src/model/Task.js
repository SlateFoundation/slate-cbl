Ext.define('Slate.cbl.model.Task', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
        'Ext.data.identifier.Negative'
    ],

    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        {
            name: 'ID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: 'Slate\\CBL\\Tasks\\Task'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'RevisionID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Modified',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'ModifierID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Title',
            type: 'string'
        },
        {
            name: 'Handle',
            type: 'string'
        },
        {
            name: 'ParentTaskID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'DueDate',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'ExpirationDate',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'Instructions',
            type: 'string',
            allowNull: true
        },
        {
            name: 'Shared',
            type: 'string'
        },
        {
            name: 'ExperienceType',
            type: 'string'
        },

        'Creator',
        'Attachments',
        'Skills',
        'ParentTask',

        {
            name: 'ParentTaskTitle',
            depends: 'ParentTask',
            mapping: 'ParentTask.Title',
            persist: false
        },{
            name: 'CreatorFullName',
            depends: 'Creator',
            persist: false,
            calculate: function(data) {
                return data.Creator.FirstName + ' ' + data.Creator.LastName;
            }
        }
    ],

    proxy: {
        type: 'slate-records',
        url: '/cbl/tasks',
        include: [
            'Creator',
            'ParentTask'
        ]
    }
});