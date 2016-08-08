/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.model.Todo', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records'
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
            defaultValue: '\\Slate\\CBL\\Tasks\\Todo'
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
        },
        {
            name: 'Description',
            type: 'string'
        },
        {
            name: 'DueDate',
            type: 'date',
            mapping: 'Task.DueDate',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'Completed',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'Cleared',
            type: 'boolean',
            defaultValue: false
        }
    ],

    proxy: {
        type: 'slate-records',
        url: '/cbl/todos'
    }

});
