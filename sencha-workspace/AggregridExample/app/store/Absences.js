Ext.define('AggregridExample.store.Absences', {
    extend: 'Ext.data.Store',

    config: {
        fields: ['id', 'student_id', 'date']
    },

    applyData: function(data) {
        var amount = Math.floor(Math.random() * 500),
            i = 0;

        if (!data) {
            data = [];

            for (; i < amount; i++) {
                data.push({
                    id: i + 1,
                    student_id: Math.floor(Math.random() * 20) + 1,
                    date: new Date(2016, Math.floor(Math.random() * 12), Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
                });
            }
        }

        return this.callParent([data]);
    }
});