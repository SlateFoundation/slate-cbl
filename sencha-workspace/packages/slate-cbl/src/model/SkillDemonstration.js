/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.SkillDemonstration', {
    extend: 'Ext.data.Model',
    requires: [
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
            name: "StudentID",
            type: "int"
        },
        {
            name: "DemonstrationID",
            type: "int"
        },
        {
            name: "SkillID",
            type: "int"
        },
        {
            name: "Demonstrated",
            type: "date",
            dateFormat: "timestamp",
            useNull: true
        },
        {
            name: "TargetLevel",
            type: "int"
        },
        {
            name: "DemonstratedLevel",
            type: "int"
        }
    ]
});