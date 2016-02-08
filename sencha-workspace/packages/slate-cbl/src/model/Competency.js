/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.Competency', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
        'Ext.data.identifier.Negative'
    ],

    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        // server-persisted fields
        { name: 'ID', type: 'int' },
        { name: 'ContentAreaID', type: 'int' },
        { name: 'Code', type: 'string'},
        { name: 'Descriptor', type: 'string'},
        { name: 'Statement', type: 'string'},

        // server-provided metadata
        { name: 'totalDemonstrationsRequired', persist: false, type: 'integer' },
        { name: 'minimumAverageOffset', persist: false, type: 'float' }
    ],

    proxy: {
        type: 'slate-records',
        url: '/cbl/competencies',
        include: ['totalDemonstrationsRequired', 'minimumAverageOffset']
    }
});