Ext.define('AggregridExample.view.MyAggregrid', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'app-myaggregrid',

    config: {
        columnsStore: 'Students',
        columnHeaderTpl: [
            '{fullName}'
        ],
        columnMapper: 'student_id',

        rowsStore: 'TimePeriods',
        rowHeaderTpl: [
            'Week #{week}'
        ],
        rowMapper: 'time_period_id', // TODO: use a time-based function instead

        dataStore: 'Absences'
    }
});