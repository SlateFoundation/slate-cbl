/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.Demonstration', {
    extend: 'Ext.data.Model',
    requires: [
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
            allowNull: true
        },
        {
            name: "Class",
            type: "string",
            defaultValue: "Slate\\CBL\\Demonstrations\\Demonstration"
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
            name: "StudentID",
            type: "int"
        },
        {
            name: "Demonstrated",
            type: "date",
            dateFormat: "timestamp",
            allowNull: true
        },
        {
            name: "ExperienceType",
            type: "string",
            allowNull: true
        },
        {
            name: "Context",
            type: "string",
            allowNull: true
        },
        {
            name: "PerformanceType",
            type: "string",
            allowNull: true
        },
        {
            name: "ArtifactURL",
            type: "string",
            allowNull: true
        },
        {
            name: "Comments",
            type: "string",
            allowNull: true
        },

        // server-provided metadata
        {
            name: 'Skills',
            defaultValue: []
        },
        {
            name: 'competencyCompletions',
            defaultValue: [],
            persist: false
        }
    ],

    proxy: {
        type: 'slate-cbl-records',
        url: '/cbl/demonstrations',
        include: ['competencyCompletions', 'Skills']
    }
});