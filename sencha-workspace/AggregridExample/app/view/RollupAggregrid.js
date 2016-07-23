Ext.define('AggregridExample.view.RollupAggregrid', {
    extend: 'Jarvus.aggregrid.RollupAggregrid',
    xtype: 'app-rollupaggregrid',

    config: {
        columnsStore: 'Students',
        columnHeaderTpl: [
            '{fullName}'
        ],
        columnMapper: 'student_id',

        rowsStore: 'SummaryTimePeriods',
        rowMapper: function(dataRecord, rowsStore) {
            var year = dataRecord.get('year'),
                month = dataRecord.get('month');

            return rowsStore.getAt(rowsStore.findBy(function(rowRecord) {
                return rowRecord.get('year') == year && rowRecord.get('month') == month;
            }));
        },

        dataStore: 'SummaryAbsences',

        cellTpl: [
            '<tpl if="records.length">',
                '{[values.records[0].record.get("absences")]}',
            '</tpl>'
        ],
        cellRenderer: function(group, cellEl) {
            var records = group.records,
                absences = records.length && records[0].record.get('absences') || 0;

            cellEl.toggleCls('attendance-perfect', absences == 0);
            cellEl.toggleCls('attendance-ok', absences > 0 && absences < 4);
            cellEl.toggleCls('attendance-bad', absences >= 4);
        },

        subRowsStore: 'TimePeriods',
        subDataStore: 'Absences',
        parentRowMapper: function(subRowRecord, rowsStore) {
            var year = subRowRecord.get('year'),
                date = Ext.Date.parse(year+Ext.String.leftPad(subRowRecord.get('week'), 2, '0'), 'YW'),
                month = date.getMonth() + 1,
                parentIndex = rowsStore.findBy(function(summaryRecord) {
                    return summaryRecord.get('year') == year && summaryRecord.get('month') == month;
                });

            return parentIndex >= 0 ? rowsStore.getAt(parentIndex) : null;
        },
        subRowHeaderTpl: [
            'Week #{week}'
        ],
        subRowMapper: function(dataRecord, subRowsStore) {
            var date = dataRecord.get('date'),
                year = parseInt(Ext.Date.format(date, 'o'), 0),
                week = Ext.Date.getWeekOfYear(date);

            return subRowsStore.getAt(subRowsStore.findBy(function(rowRecord) {
                return rowRecord.get('year') == year && rowRecord.get('week') == week;
            }));
        },
        subCellRenderer: function(group, cellEl) {
            var absences = group.records.length;

            cellEl.toggleCls('attendance-perfect', absences == 0);
            cellEl.toggleCls('attendance-ok', absences == 1);
            cellEl.toggleCls('attendance-bad', absences >= 2);
        }
    }
});