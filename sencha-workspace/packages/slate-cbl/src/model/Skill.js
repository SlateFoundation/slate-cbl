/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.Skill', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
        'Ext.data.identifier.Negative',
        'Ext.data.Store'
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
        {
            name: "DemonstrationsRequired",
            type: "int",
            defaultValue: 2
        },
        {
            name: 'Code_Descriptor',
            depends: ['Code', 'Descriptor'],
            persist: false,
            calculate: function(data) {
                return [data.Code, '-', data.Descriptor].join(' ');
            }
        },
        {
            name: "CompetencyDescriptor",
            type: "string",
            persist: false
        }
    ],

    proxy: {
        type: 'slate-records',
        url: '/cbl/skills',
        include: 'CompetencyDescriptor'
    }
});