Ext.define('AggregridExample.store.TimePeriods', {
    extend: 'Ext.data.Store',


    config: {
        fields: ['id', 'week', 'year']
    },

    applyData: function(data) {
        var i = 0;

        if (!data) {
            data = [];

            for (; i < 52; i++) {
                data.push({
                    id: i + 1,
                    week: i + 1,
                    year: 2016
                });
            }
        }

        return this.callParent([data]);
    }
});