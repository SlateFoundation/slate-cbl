Ext.define('AggregridExample.store.TimePeriod', {
    extend: 'Ext.data.Store',

    alias: 'store.timeperiod',

    fields: [
        'month', 'week', 'year'
    ],

    data: { 
        items: function(){
            var i, data = [];
            for (i = 0;i <= 12;i++){
                data.push({ year: '2016', month: faker.date.month(), weeks: ['week_1','week_2','week_3','week_4'] })                
            }
            return data;
        }
    },

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});
