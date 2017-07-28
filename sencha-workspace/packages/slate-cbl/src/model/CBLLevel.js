/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.CBLLevel', {
    extend: 'Ext.data.Model',

    // model config
    idProperty: 'level',

    fields: [
        // server-persisted fields
        { name: 'level', type: 'int' },
        { name: 'colorCode', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'label', type: 'string' },
        { name: 'description', type: 'string' }
    ]
});
