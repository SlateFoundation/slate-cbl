Ext.define('AggregridExample.store.Absences', {
    extend: 'Ext.data.Store',

    fields: [
       'id', 'student_id', 'time_period_id', 'attendance'
    ],

    data: { 
        items: [
            {id: 1, student_id: '1', time_period_id: 1, attendance: '100%'},
            {id: 2, student_id: '2', time_period_id: 1, attendance: '90%'},
            {id: 3, student_id: '3', time_period_id: 1, attendance: '80%'},
            {id: 4, student_id: '4', time_period_id: 1, attendance: '60%'},
            {id: 5, student_id: '5', time_period_id: 1, attendance: '70%'},
            {id: 6, student_id: '6', time_period_id: 1, attendance: '90%'},
            {id: 7, student_id: '7', time_period_id: 1, attendance: '50%'},
            {id: 8, student_id: '8', time_period_id: 1, attendance: '40%'},
            {id: 9, student_id: '9', time_period_id: 1, attendance: '80%'},
            {id: 10, student_id: '10', time_period_id: 1, attendance: '60%'},
            {id: 11, student_id: '11', time_period_id: 1, attendance: '80%'},
            {id: 12, student_id: '12', time_period_id: 1, attendance: '70%'},
            {id: 13, student_id: '13', time_period_id: 1, attendance: '90%'},
            {id: 14, student_id: '14', time_period_id: 1, attendance: '60%'},
            {id: 15, student_id: '15', time_period_id: 1, attendance: '80%'},
            {id: 16, student_id: '16', time_period_id: 1, attendance: '80%'},
            {id: 17, student_id: '17', time_period_id: 1, attendance: '90%'},
            {id: 18, student_id: '18', time_period_id: 1, attendance: '100%'},
            {id: 19, student_id: '19', time_period_id: 1, attendance: '100%'},
            {id: 20, student_id: '20', time_period_id: 1, attendance: '80%'},
            {id: 21, student_id: '21', time_period_id: 1, attendance: '100%'},
            {id: 22, student_id: '22', time_period_id: 1, attendance: '90%'},
            {id: 23, student_id: '23', time_period_id: 1, attendance: '100%'},
            {id: 24, student_id: '24', time_period_id: 1, attendance: '80%'},
            {id: 25, student_id: '25', time_period_id: 1, attendance: '100%'},
            {id: 26, student_id: '26', time_period_id: 1, attendance: '100%'},
            {id: 27, student_id: '27', time_period_id: 1, attendance: '80%'},
            {id: 28, student_id: '28', time_period_id: 1, attendance: '100%'},
            {id: 29, student_id: '29', time_period_id: 1, attendance: '100%'},
            {id: 30, student_id: '30', time_period_id: 1, attendance: '90%'},
            {id: 31, student_id: '31', time_period_id: 1, attendance: '100%'},
            {id: 32, student_id: '32', time_period_id: 1, attendance: '80%'},
            {id: 33, student_id: '33', time_period_id: 1, attendance: '100%'},
            {id: 34, student_id: '34', time_period_id: 1, attendance: '100%'}           
        ]
    },

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});
