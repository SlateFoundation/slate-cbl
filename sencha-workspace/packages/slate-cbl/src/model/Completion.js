/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.Completion', {
    extend: 'Ext.data.Model',

    // model config
    fields: [
        { name: 'StudentID', type: 'int' },
        { name: 'CompetencyID', type: 'int' },
        { name: 'currentLevel', type: 'int', allowNull: true },
        { name: 'demonstrationsCount', type: 'int' },
        { name: 'demonstrationsAverage', type: 'float', allowNull: true }
    ]
});