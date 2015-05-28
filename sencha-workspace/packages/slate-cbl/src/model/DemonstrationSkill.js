/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.DemonstrationSkill', {
    extend: 'Ext.data.Model',
    requires: [
        'Emergence.ext.proxy.Records',
        'Ext.data.identifier.Negative'
    ],


    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        {
            name: 'ID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'DemonstrationID',
            type: 'int'
        },
        {
            name: 'SkillID',
            type: 'int'
        },
        {
            name: 'TargetLevel',
            type: 'int',
            allowNull: true
        },
        {
            name: 'DemonstratedLevel',
            type: 'int'
        },
        {
            name: 'Override',
            type: 'boolean'
        },
        
        // dynamic fields that might be provided directly by server in some results
        {
            name: 'Demonstration',
            persist: false
        },
        {
            name: 'Demonstrated',
            depends: ['Demonstration'],
            persist: false,

            type: 'date',
            convert: function(v, r) {
                if (r.data.Demonstration && r.data.Demonstration.Demonstrated) {
                    v = r.data.Demonstration.Demonstrated;
                }

                if (Ext.isDate(v)) {
                    return v;
                }

                return v ? new Date(v * 1000) : null;
            }
        },
        {
            name: 'StudentID',
            depends: ['Demonstration'],
            persist: false,

            type: 'int',
            convert: function(v, r) {
                return v || (r.data.Demonstration && r.data.Demonstration.StudentID);
            }
        }
    ],

    proxy: {
        type: 'records',
        url: '/cbl/demonstration-skills',
        include: 'Demonstration.Creator'
    }
});