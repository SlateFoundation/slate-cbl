Ext.define('AggregridExample.store.Absence', {
    extend: 'Ext.data.Store',

    alias: 'store.absence',

    fields: [
        'student_id', 'year', 'month', 'week', 'attendance'
    ],

    data: { 
        items: function(){
            var i, data = [],
                weeks = ['week_1', 'week_2', 'week_3', 'week_4'],
            for (i = 0;i <= 100;i++){
                data.push({ student_id: Math.floor(Math.random() * 100) + 1, year: '2016', month: faker.date.month(), week: weeks[Math.floor(Math.random() * 4)], attendance: Math.floor(Math.random() * 100) + 1 + '%'  })                
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
