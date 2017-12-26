Ext.define('Slate.cbl.model.Competency', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.Competencies',
        'Ext.data.identifier.Negative',
        'Ext.data.validator.Range',
        'Ext.data.validator.Presence',
        'Ext.data.validator.Format'
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
            defaultValue: 'Slate\\CBL\\Competency'
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

        // Competency fields
        {
            name: 'ContentAreaID',
            type: 'int'
        },
        {
            name: 'Code',
            type: 'string'
        },
        {
            name: 'Descriptor',
            type: 'string'
        },
        {
            name: 'Statement',
            type: 'string'
        }
    ],

    proxy: 'slate-cbl-competencies',

    validators: [
        {
            field: 'ContentAreaID',
            type: 'min',
            min: 1,
            emptyMessage: 'ContentAreaID is required'
        },
        {
            field: 'Code',
            type: 'presence',
            message: 'Code is required'
        },
        {
            field: 'Code',
            type: 'format',
            matcher: /^[a-zA-Z][a-zA-Z0-9_:\.-]*$/,
            message: 'Code can only contain letters, numbers, hyphens, underscores, and periods'
        },
        {
            field: 'Descriptor',
            type: 'presence',
            message: 'Descriptor is required'
        }
    ],


    getTotalDemonstrationsRequired: function(level) {
        var totalDemonstrationsRequired = this.get('totalDemonstrationsRequired');

        return totalDemonstrationsRequired[level] || totalDemonstrationsRequired.default;
    }
});