Ext.define('AggregridExample.store.Student', {
    extend: 'Ext.data.Store',

    alias: 'store.student',

    fields: [
        'fullName', 'email', 'phone', 'guardianName', 'guardianPhone'
    ],

    data: { 
        items: function(){
            var i, data = [];
            for (i = 0;i <= 100;i++){
                data.push({ fullName: faker.name.findName(), email: faker.internet.email(), phone: faker.phone.phoneNumber, guardianName: faker.name.findName(), guardianPhone: faker.phone.phoneNumber() })                
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
