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

    proxy: 'slate-cbl-contentareas',


    // static methods
    inheritableStatics: {
        handleProperty: 'Code',
        loadByCode: function(code, options, session) {
            var record = new this({ Code: code }, session);

            options = Ext.Object.chain(options);
            options.recordHandle = code;

            record.load(options);

            return record;
        }
    }
});