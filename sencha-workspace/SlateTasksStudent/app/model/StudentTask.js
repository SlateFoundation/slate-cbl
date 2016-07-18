/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.model.StudentTask', {
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
            defaultValue: '\\Slate\\CBL\\Tasks\\StudentTask'
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
            name: 'TaskID',
            reference: 'Task',
            type: 'int'
        },
        {
            name: 'TaskStatus',
            type: 'string'
        },
        {
            name: 'TaskClass',
            type: 'string',
            mapping: 'Task.Class',
            defaultValue: '\\Slate\\CBL\\Tasks\\Task'
        },
        {
            name: 'TaskCreated',
            type: 'date',
            mapping: 'Task.Created',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'Title',
            type: 'string',
            mapping: 'Task.Title',
            allowNull: true
        },
        {
            name: 'Status',
            mapping: 'Task.Status',
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
            name: 'ExpirationDate',
            type: 'date',
            mapping: 'Task.ExpirationDate',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'Instructions',
            type: 'string',
            mapping: 'Task.Instructions',
            allowNull: true
        },
        {
            name: 'ParentTaskID',
            type: 'int',
            mapping: 'Task.ParentTaskID',
            allowNull: true
        },
        {
            name: 'FirstName',
            mapping: 'Student.FirstName',
            type: 'string'
        },
        {
            name: 'LastName',
            mapping: 'Student.LastName',
            type: 'string'
        },
        {
            name: 'FullName',
            depends: ['FirstName', 'LastName'],
            convert: function(v,r) {
                return r.get('FirstName') + ' ' + r.get('LastName');
            }
        }
    ],

    proxy: {
        type: 'slate-records',
        url: 'cbl/student-tasks',
        include: [
            'Task',
            'Student',
            'Task.ParentTask',
            'Task.Skills.Competencies'
        ]
    }

});
