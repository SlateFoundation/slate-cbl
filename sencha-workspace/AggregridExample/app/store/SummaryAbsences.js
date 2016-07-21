Ext.define('AggregridExample.store.SummaryAbsences', {
    extend: 'Ext.data.Store',

    config: {
        fields: ['year', 'month', 'student_id', 'absences']
    },

    applyData: function(data) {
        var studentId = 1,
            month;

        if (!data) {
            data = [];

            for (; studentId <= 20; studentId++) {
                for (month = 1; month <= 12; month++) {
                    data.push({
                        year: 2016,
                        month: month,
                        student_id: studentId,
                        absences: Math.floor(Math.random() * 10)
                    });
                }
            }
        }

        return this.callParent([data]);
    }
});