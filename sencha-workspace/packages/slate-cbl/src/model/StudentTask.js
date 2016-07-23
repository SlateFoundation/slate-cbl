/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.StudentTask', {
    extend: 'Ext.data.Model',
    requires: [
        'Emergence.ext.proxy.Records',
        'Ext.data.identifier.Negative'
    ],


    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        {
            name: "ID",
            type: "int",
            allowNull: true
        },
        {
            name: "Class",
            type: "string",
            defaultValue: "Slate\\CBL\\Tasks\\StudentTask"
        },
        {
            name: "Created",
            type: "date",
            dateFormat: "timestamp",
            allowNull: true
        },
        {
            name: "CreatorID",
            type: "int",
            allowNull: true
        },
        {
            name: "RevisionID",
            type: "int",
            allowNull: true
        },
        {
            name: "Modified",
            type: "date",
            dateFormat: "timestamp",
            allowNull: true
        },
        {
            name: "ModifierID",
            type: "int",
            allowNull: true
        },
        {
            name: "TaskID",
            type: "int"
        },
        {
            name: "StudentID",
            type: "int"
        },
        {
            name: "ExperienceType",
            type: "string",
            allowNull: true
        },
        {
            name: "DueDate",
            type: "date",
            dateFormat: "timestamp",
            allowNull: true
        },
        {
            name: "ExpirationDate",
            type: "date",
            dateFormat: "timestamp",
            allowNull: true
        },
        {
            name: "TaskStatus",
            type: "string",
            defaultValue: "assigned"
        }
    ],

    proxy: {
        type: 'slate-records',
        url: '/cbl/student-tasks'
    }
});