/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.model.ContentArea', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.API',
        'Slate.cbl.proxy.Records',
        'Ext.data.identifier.Negative'
    ],


    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        {
            name: "ID",
            type: "int",
            useNull: true
        },
        {
            name: "Class",
            type: "string",
            defaultValue: "Slate\\CBL\\ContentArea"
        },
        {
            name: "Created",
            type: "date",
            dateFormat: "timestamp",
            useNull: true
        },
        {
            name: "CreatorID",
            type: "int",
            useNull: true
        },
        {
            name: "Code",
            type: "string"
        },
        {
            name: "Title",
            type: "string"
        }
    ],

    proxy: {
        type: 'slate-cbl-records',
        url: '/cbl/content-areas'
    }
});