Ext.define('AggregridExample.view.MyAggregrid', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'app-myaggregrid',

    config: {
        columnsStore: 'Students',
        columnHeaderTpl: [
            '{fullName}'
        ],
        rowHeaderTpl: [
            '{week}'
        ],
        rowsStore: 'TimePeriods',
        rowHeaderField: 'taskName'
    }
});