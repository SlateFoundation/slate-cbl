Ext.define('AggregridExample.store.Absences', {
    extend: 'Ext.data.Store',

    config: {
        fields: [
            'id', 'student_id', 'time_period_id', 'attendance'
        ],
        
        data: function() {
            var arr = [],
                amount = 100,
                i,
                obj;
                
            for (i=0; i<amount; i++) {
                obj = {
                    id: Math.floor(Math.random() * 100) + 1,
                    student_id: Math.floor(Math.random() * 20) + 1,
                    time_period_id: Math.floor(Math.random() * 52) + 1,
                    attendance: Math.floor(Math.random() * 100) + 1   
                }
                
                arr.push(obj);
            }                                                                   
            
            return arr
        },
    },
    
});