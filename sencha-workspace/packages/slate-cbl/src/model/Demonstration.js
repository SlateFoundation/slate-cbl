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
            useNull: true
        },
        {
            name: "Class",
            type: "string",
            defaultValue: "Slate\\CBL\\Demonstration"
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
            name: "StudentID",
            type: "int"
        },
//        {
//            name: "SkillID",
//            type: "int"
//        },
        {
            name: "Demonstrated",
            type: "date",
            dateFormat: "timestamp",
            useNull: true
        },
//        {
//            name: "Level",
//            type: "string"
//        },
        {
            name: "ExperienceType",
            type: "string"
        },
        {
            name: "Context",
            type: "string"
        },
        {
            name: "PerformanceType",
            type: "string"
        },
        {
            name: "ArtifactURL",
            type: "string",
            useNull: true
        },
        {
            name: "Comments",
            type: "string",
            useNull: true
        },

        // server-provided metadata
        {
            name: 'competencyCompletions',
            defaultValue: [],
            persist: false
        }
    ],

    proxy: {
        type: 'slate-cbl-records',
        url: '/cbl/demonstrations'
    }
});