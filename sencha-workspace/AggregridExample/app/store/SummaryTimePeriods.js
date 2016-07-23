Ext.define('AggregridExample.store.SummaryTimePeriods', {
    extend: 'Ext.data.Store',


    config: {
        fields: ['id', 'month', 'year', 'title']
    },

    applyData: function(data) {
        var i = 0;

        if (!data) {
            data = [];

            for (; i < 12; i++) {
                data.push({
                    id: i + 1,
                    month: i + 1,
                    year: 2016,
                    title: Ext.Date.monthNames[i] + ' 2016'
                });
            }
        }

        return this.callParent([data]);
    }
});