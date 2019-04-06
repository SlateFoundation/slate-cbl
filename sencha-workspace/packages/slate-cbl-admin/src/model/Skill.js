/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.admin.model.Skill', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
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
            defaultValue: "Slate\\CBL\\Skill"
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
            name: "CompetencyID",
            type: "int"
        },
        {
            name: "Code",
            type: "string"
        },
        {
            name: "Descriptor",
            type: "string"
        },
        {
            name: "Statement",
            type: "string"
        },
        'DemonstrationsRequired'
    ],

    proxy: {
        type: 'slate-records',
        url: '/cbl/skills'
    }
});