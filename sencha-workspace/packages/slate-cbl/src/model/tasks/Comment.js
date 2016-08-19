/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.tasks.Comment', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records'
    ],
    // model config
    idProperty: 'ID',

    fields: [
        {
            name: 'ID',
            type: 'int'
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: 'Emergence\\Comments\\Comment'
        },
        {
            name: 'ContextClass',
            type: 'string',
            defaultValue: 'Slate\\CBL\\Tasks\\StudentTask'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp'
        },
        {
            name: 'CreatorID',
            type: 'int'
        },
        {
            name: 'Message',
            type: 'string',
            allowNull: true
        }
    ],

    proxy: {
        type: 'slate-records',
        url: '/comments'
    }
});
