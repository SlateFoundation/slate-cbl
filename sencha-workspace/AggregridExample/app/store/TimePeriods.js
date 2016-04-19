Ext.define('AggregridExample.store.TimePeriods', {
    extend: 'Ext.data.Store',

    fields: [
       'id', 'month', 'week', 'year'
    ],

    data: { 
        items: [
            {id: 1, month: '1', week: '1', year: '2016'},
            {id: 2, month: '1', week: '2', year: '2016'},
            {id: 3, month: '1', week: '3', year: '2016'},
            {id: 4, month: '1', week: '4', year: '2016'},
            
            {id: 5, month: '2', week: '5', year: '2016'},
            {id: 6, month: '2', week: '6', year: '2016'},
            {id: 7, month: '2', week: '7', year: '2016'},
            {id: 8, month: '2', week: '8', year: '2016'},
            {id: 9, month: '2', week: '9', year: '2016'},
            
            {id: 10, month: '3', week: '10', year: '2016'},
            {id: 11, month: '3', week: '11', year: '2016'},
            {id: 12, month: '3', week: '12', year: '2016'},
            {id: 13, month: '3', week: '13', year: '2016'},
            
            {id: 14, month: '4', week: '14', year: '2016'},
            {id: 15, month: '4', week: '15', year: '2016'},
            {id: 16, month: '4', week: '16', year: '2016'},
            {id: 17, month: '4', week: '17', year: '2016'},
            
            {id: 18, month: '5', week: '18', year: '2016'},
            {id: 19, month: '5', week: '19', year: '2016'},
            {id: 20, month: '5', week: '20', year: '2016'},
            {id: 21, month: '5', week: '21', year: '2016'},
            {id: 22, month: '5', week: '22', year: '2016'},
            
            {id: 23, month: '6', week: '23', year: '2016'},
            {id: 24, month: '6', week: '24', year: '2016'},
            {id: 25, month: '6', week: '25', year: '2016'},
            {id: 26, month: '6', week: '26', year: '2016'},
            
            {id: 27, month: '7', week: '27', year: '2016'},
            {id: 28, month: '7', week: '28', year: '2016'},
            {id: 29, month: '7', week: '29', year: '2016'},
            {id: 30, month: '7', week: '30', year: '2016'},
            
            {id: 31, month: '8', week: '31', year: '2016'},
            {id: 32, month: '8', week: '32', year: '2016'},
            {id: 33, month: '8', week: '33', year: '2016'},
            {id: 34, month: '8', week: '34', year: '2016'},
            {id: 35, month: '9', week: '35', year: '2016'},
            
            {id: 36, month: '9', week: '36', year: '2016'},
            {id: 37, month: '9', week: '37', year: '2016'},
            {id: 38, month: '9', week: '38', year: '2016'},
            {id: 39, month: '9', week: '39', year: '2016'},
            
            {id: 40, month: '10', week: '40', year: '2016'},
            {id: 41, month: '10', week: '41', year: '2016'},
            {id: 42, month: '10', week: '42', year: '2016'},
            {id: 43, month: '10', week: '43', year: '2016'},
            {id: 44, month: '11', week: '44', year: '2016'},
            
            {id: 45, month: '11', week: '45', year: '2016'},
            {id: 46, month: '11', week: '46', year: '2016'},
            {id: 47, month: '11', week: '47', year: '2016'},
            {id: 48, month: '11', week: '48', year: '2016'},
            
            {id: 49, month: '12', week: '49', year: '2016'},   
            {id: 50, month: '12', week: '50', year: '2016'},           
            {id: 51, month: '12', week: '51', year: '2016'},            
            {id: 52, month: '12', week: '52', year: '2016'},           
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
