Ext.define('AggregridExample.view.MyAggregrid', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'app-myaggregrid',

    config: {
        columnsStore: 'Students',
        columnHeaderTpl: [
            '{fullName}'
        ],

        rowsStore: 'TimePeriods',
        rowHeaderTpl: [
            '{week}'
        ]
    }
});