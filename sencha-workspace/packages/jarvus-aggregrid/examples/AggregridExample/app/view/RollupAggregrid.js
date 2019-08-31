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
            '<tpl else>',
                '&mdash;',
            '</tpl>'
        ],
        cellRenderer: function(group, cellEl, rendered) {
            var records = group.records,
                absences = records.length && records[0].record.get('absences') || 0,
                attendanceCls = rendered.attendanceCls;

            if (rendered) {
                group.tplNode.nodeValue = absences || '—';
            }

            if (absences != rendered.absences) {
                if (absences >= 4) {
                    attendanceCls = 'bad';
                } else if (absences > 0) {
                    attendanceCls = 'ok';
                } else {
                    attendanceCls = 'perfect';
                }

                if (!rendered || attendanceCls != rendered.attendanceCls) {
                    if (rendered) {
                        cellEl.removeCls('attendance-'+rendered.attendanceCls);
                    }

                    cellEl.addCls('attendance-'+attendanceCls);
                }
            }

            return {
                absences: absences,
                attendanceCls: attendanceCls
            };
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
        subCellTpl: '{records.length}',
        subCellRenderer: function(group, cellEl, rendered) {
            var records = group.records,
                absences = records && records.length || 0,
                attendanceCls = rendered.attendanceCls;

            if (rendered) {
                group.tplNode.nodeValue = absences;
            }

            if (absences != rendered.absences) {
                if (absences >= 2) {
                    attendanceCls = 'bad';
                } else if (absences == 1) {
                    attendanceCls = 'ok';
                } else {
                    attendanceCls = 'perfect';
                }

                if (!rendered || attendanceCls != rendered.attendanceCls) {
                    if (rendered) {
                        cellEl.removeCls('attendance-'+rendered.attendanceCls);
                    }

                    cellEl.addCls('attendance-'+attendanceCls);
                }
            }

            return {
                absences: absences,
                attendanceCls: attendanceCls
            };
        }
    }
});