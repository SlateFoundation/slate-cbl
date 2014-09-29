/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.model.Skill', {
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
            defaultValue: "Slate\\CBL\\Skill"
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
            name: "RevisionID",
            type: "int",
            useNull: true
        },
        {
            name: "CompetencyID",
            type: "int"
        },
        {
            name: "Code",
            type: "string"
        },
        {
            name: "Descriptor",
            type: "string"
        },
        {
            name: "Statement",
            type: "string"
        },
        {
            name: "DemonstrationsRequired",
            type: "int",
            defaultValue: 2
        }
    ],

    proxy: {
        type: 'slate-cbl-records',
        url: '/cbl/skills'
    },

    getDemonstrationsByStudent: function(studentId, callback, scope, include) {
        var me = this;

        Slate.cbl.API.request({
            method: 'GET',
            url: '/cbl/skills/' + me.get('Code') + '/demonstrations',
            params: {
                student: studentId,
                include: include || 'Demonstration,Demonstration.Creator'
            },
            success: function(response) {
                Ext.callback(callback, scope, [response.data && response.data.data]);
            }
        });
    }
});