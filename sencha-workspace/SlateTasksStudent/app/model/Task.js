/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.model.Task', {
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
            defaultValue: '\\Slate\\CBL\\Tasks\\Task'
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
            name: 'Title',
            type: 'string',
            allowNull: true
        },
        {
            name: 'Handle',
            type: 'string',
            allowNull: true
        },
        {
            name: 'Status',
            type: 'string',
            defaultValue: 'Live'
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
            name: 'ParentTaskID',
            type: 'int',
            allowNull: true
        }
    ],

    proxy: {
        type: 'slate-records',
        url: 'cbl/tasks'
    }

});
