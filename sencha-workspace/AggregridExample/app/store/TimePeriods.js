Ext.define('AggregridExample.store.TimePeriods', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'id',
            'week',
            'year',
            {
                name: 'startDate',
                depends: ['week', 'year'],
                convert: function(v, r) {
                    return Ext.Date.parse(r.get('year')+Ext.String.leftPad(r.get('week'), 2, '0'), 'oW');
                }
            },
            {
                name: 'endDate',
                depends: ['week', 'year'],
                convert: function(v, r) {
                    return Ext.Date.parse(r.get('year')+Ext.String.leftPad(r.get('week')+1, 2, '0'), 'oW');
                }
            }
        ]
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