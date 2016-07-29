/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.model.StudentTask', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
        'Slate.cbl.model.tasks.Attachment',
        'Slate.cbl.model.tasks.Comment',
        'Slate.cbl.model.Skill'
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
            name: 'Submitted',
            type: 'date',
            mapping: 'Submitted',
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
            name: 'ParentTaskTitle',
            type: 'string'
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
        },
        {
            name: 'Competencies',
            persist: false
        },
        {
            name: 'SkillRatings',
            type: 'auto'
        },
        {
            name: 'filtered',
            type: 'boolean',
            persist: false,
            defaultValue: false
        }
    ],

    hasMany: [{
        model: 'Slate.cbl.model.tasks.Attachment',
        name: 'Attachments',
        associationKey: 'Attachments'
    },{
        model: 'Slate.cbl.model.tasks.Attachment',
        name: 'TaskAttachments',
        associationKey: 'Task.Attachments'
    },{
        model: 'Slate.cbl.model.tasks.Comment',
        name: 'Comments',
        associationKey: 'Comments'
    },{
        model: 'Slate.cbl.model.Skill',
        name: 'Skills',
        associationKey: 'Task.Skills'
    }],

    proxy: {
        type: 'slate-records',
        url: '/cbl/student-tasks',
        include: [
            'Task',
            'Student',
            'Comments',
            'Attachments',
            'SkillRatings',
            'Task.Attachments',
            'Task.ParentTask',
            'Task.Skills.Competency',
            'Task.Skills.CompetencyLevel'
        ]
    }

});
