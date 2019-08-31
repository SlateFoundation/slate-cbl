Ext.define('Slate.cbl.model.demonstrations.Demonstration', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.demonstrations.Demonstrations',
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
            defaultValue: 'Slate\\CBL\\Demonstrations\\Demonstration'
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

        // VersionedRecord fields
        {
            name: 'Modified',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true,
            persist: false
        },
        {
            name: 'ModifierID',
            type: 'int',
            allowNull: true,
            persist: false
        },

        // Demonstration fields
        {
            name: 'StudentID',
            type: 'int'
        },
        {
            name: 'Demonstrated',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'ArtifactURL',
            type: 'string'
        },
        {
            name: 'Comments',
            type: 'string'
        },
        {
            name: 'ExperienceType',
            type: 'string'
        },
        {
            name: 'Context',
            type: 'string'
        },
        {
            name: 'PerformanceType',
            type: 'string'
        },

        // writable dynamic fields
        {
            name: 'DemonstrationSkills',
            defaultValue: []
        }
    ],

    proxy: {
        type: 'slate-cbl-demonstrations',
        include: 'DemonstrationSkills'
    },

    validators: [
        {
            field: 'StudentID',
            type: 'presence',
            message: 'StudentID is required'
        },
        {
            field: 'ExperienceType',
            type: 'presence',
            message: 'ExperienceType is required'
        },
        {
            field: 'Context',
            type: 'presence',
            message: 'Context is required'
        },
        {
            field: 'PerformanceType',
            type: 'presence',
            message: 'PerformanceType is required'
        }
    ]
});