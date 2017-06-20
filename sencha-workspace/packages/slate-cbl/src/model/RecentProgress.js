/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.RecentProgress', {
    extend: 'Ext.data.Model',

    // model config
    fields: [
        { name: 'rating', type: 'int' },
        { name: 'demonstrationCreated', type: 'date', dateFormat: 'timestamp' },
        { name: 'teacherTitle', type: 'string' },
        { name: 'competencyDescriptor', type: 'string' },
        { name: 'skillDescriptor', type: 'string' }
    ]
});