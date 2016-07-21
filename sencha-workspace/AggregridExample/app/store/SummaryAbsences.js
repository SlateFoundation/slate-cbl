Ext.define('AggregridExample.store.SummaryAbsences', {
    extend: 'Ext.data.Store',

    config: {
        fields: ['year', 'month', 'student_id', 'absences']
    }
});