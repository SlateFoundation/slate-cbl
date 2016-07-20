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
        rowMapper: function(dataRecord, rowsStore) {
            var date = dataRecord.get('date'),
                year = date.getFullYear(),
                week = Ext.Date.getWeekOfYear(date);

            // week 53 in January should be considered in the previous year
            if (week == 53 && date.getMonth() == 0) {
                year--;
            }

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