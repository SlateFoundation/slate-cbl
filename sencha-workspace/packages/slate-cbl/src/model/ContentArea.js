Ext.define('Slate.cbl.model.ContentArea', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.ContentAreas',
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
            defaultValue: 'Slate\\CBL\\ContentArea'
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
            name: 'Code',
            type: 'string'
        },
        {
            name: 'Title',
            type: 'string'
        }
    ],

    proxy: {
        type: 'slate-cbl-contentareas'
    }
});