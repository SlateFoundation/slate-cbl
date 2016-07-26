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

        cellRenderer: function(group, cellEl, rendered) {
            var absences = group.records.length,
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