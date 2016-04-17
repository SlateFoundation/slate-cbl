Ext.define('AggregridExample.view.MyAggregrid', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'app-myaggregrid',

    config: {
        columnsStore: Ext.create('AggregridExample.store.Student'),
        columnHeaderTpl: [
            '{fullName}'
        ],
        rowHeaderTpl: [
            '{week}'
        ],
        rowsStore: Ext.create('AggregridExample.store.TimePeriod'),
        rowHeaderField: 'taskName'
    }
});