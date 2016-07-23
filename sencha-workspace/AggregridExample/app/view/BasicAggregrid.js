Ext.define('AggregridExample.view.BasicAggregrid', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'app-basicaggregrid',

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
        rowMapper: function(dataRecord, rowsStore) {
            var date = dataRecord.get('date'),
                year = parseInt(Ext.Date.format(date, 'o'), 0),
                week = Ext.Date.getWeekOfYear(date);

            return rowsStore.getAt(rowsStore.findBy(function(rowRecord) {
                return rowRecord.get('year') == year && rowRecord.get('week') == week;
            }));
        },

        dataStore: 'Absences',

        cellRenderer: function(group, cellEl) {
            var absences = group.records.length;

            cellEl.toggleCls('attendance-perfect', absences == 0);
            cellEl.toggleCls('attendance-ok', absences == 1);
            cellEl.toggleCls('attendance-bad', absences >= 2);
        }
    }
});