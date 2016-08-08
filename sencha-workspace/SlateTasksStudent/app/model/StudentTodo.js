/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.model.StudentTodo', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
        'SlateTasksStudent.model.Todo'
    ],

    // model config
    idProperty: 'ID',

    fields: [
        {
            name: 'ID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: '\\Slate\\Courses\\SectionParticipant'
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
            name: 'StudentID',
            reference: 'Student',
            type: 'int'
        },
        {
            name: 'SectionID',
            reference: 'Section',
            type: 'int'
        }
    ],

    hasMany: [{
        model: 'SlateTasksStudent.model.Todo',
        name: 'Todos',
        associationKey: 'Todos'
    }],

    proxy: {
        type: 'slate-records',
        url: '/cbl/todos',
        include: [
            'Person',
            'Section',
            'Todos'
        ]
    }

});
