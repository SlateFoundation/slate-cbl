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
        }
    }
});