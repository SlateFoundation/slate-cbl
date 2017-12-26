Ext.define('Slate.cbl.model.StudentCompetency', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.StudentCompetencies',
        'Ext.data.identifier.Negative',
        'Ext.data.validator.Range'
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
            defaultValue: 'Slate\\CBL\\StudentCompetency'
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

        // StudentCompetency fields
        {
            name: 'StudentID',
            type: 'int'
        },
        {
            name: 'CompetencyID',
            type: 'int'
        },
        {
            name: 'Level',
            type: 'int'
        },
        {
            name: 'EnteredVia',
            type: 'string'
        },
        {
            name: 'BaselineRating',
            type: 'float',
            allowNull: true
        }
    ],

    proxy: 'slate-cbl-studentcompetencies',

    validators: [
        {
            field: 'StudentID',
            type: 'min',
            min: 1,
            emptyMessage: 'StudentID is required'
        },
        {
            field: 'CompetencyID',
            type: 'min',
            min: 1,
            emptyMessage: 'CompetencyID is required'
        }
    ]
});