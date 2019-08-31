Ext.define('AggregridExample.store.Absences', {
    extend: 'Ext.data.Store',

    config: {
        fields: ['id', 'student_id', 'date']
    }
});