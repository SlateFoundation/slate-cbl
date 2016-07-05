/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.tasks.Attachment', {
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
            defaultValue: "Slate\\CBL\\Tasks\\Attachments\\Link"
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
            name: "TaskID",
            type: "int"
        },
        {
            name: "Title",
            type: "string",
            allowNull: true
        },
        {
            name: "ExternalID",
            type: "string",
            allowNull: true
        },
        {
            name: "URL",
            type: "string",
            allowNull: true
        },
        {
            name: 'kind',
            persist: false,
            depends: ['Class'],
            calculate: function(data) {
                switch (data.Class) {
                    case 'Slate\\CBL\\Tasks\\Attachments\\GoogleDocument':
                        return 'doc';

                    case 'Slate\\CBL\\Tasks\\Attachments\\Link':
                    default:
                        return null;
                }
            }
        },
        {
            name: 'title',
            persist: false,
            depends: ['Title', 'URL'],
            calculate: function(data) {
                return data.Title || data.URL || 'Untitled';
            }

        }
    ]
});