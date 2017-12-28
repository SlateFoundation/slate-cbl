Ext.define('Slate.cbl.model.demonstrations.DemonstrationSkill', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.demonstrations.DemonstrationSkills',
        'Ext.data.identifier.Negative',
        'Ext.data.validator.Presence'
    ],


    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [

        // ActiveRecord fields
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
            allowNull: true,
            persist: false
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true,
            persist: false
        },

        // DemonstrationSkill fields
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
            type: 'boolean',
            defaultValue: false
        },

        // virtual fields
        {
            name: 'Demonstrated',
            mapping: 'Demonstration.Demonstrated',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true,
            persist: false
        }
    ],

    proxy: 'slate-cbl-demonstrationskills',

    validators: [
        {
            field: 'DemonstrationID',
            type: 'presence',
            message: 'DemonstrationID is required'
        },
        {
            field: 'SkillID',
            type: 'presence',
            message: 'SkillID is required'
        },
        {
            field: 'TargetLevel',
            type: 'presence',
            message: 'TargetLevel is required'
        },
        {
            field: 'DemonstratedLevel',
            type: 'presence',
            message: 'DemonstratedLevel is required'
        }
    ]
});