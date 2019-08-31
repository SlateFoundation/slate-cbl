Ext.define('AggregridExample.store.Students', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'id', 'fullName', 'email', 'phone', 'guardianName', 'guardianPhone'
        ],

        data: [
            {id: 1, fullName: 'Ali', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Linda', guardianPhone: '215-666-9999'},
            {id: 2, fullName: 'John', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Ashley', guardianPhone: '215-666-9999'},
            {id: 3, fullName: 'Bill', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Marykate', guardianPhone: '215-666-9999'},
            {id: 4, fullName: 'Mike', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Kaley', guardianPhone: '215-666-9999'},
            {id: 5, fullName: 'KJ', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Madeline', guardianPhone: '215-666-9999'},
            {id: 6, fullName: 'Chuckles', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Sarah', guardianPhone: '215-666-9999'},
            {id: 7, fullName: 'Jason', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Julie', guardianPhone: '215-666-9999'},
            {id: 8, fullName: 'Nick', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Sam', guardianPhone: '215-666-9999'},
            {id: 9, fullName: 'Tom', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Mary', guardianPhone: '215-666-9999'},
            {id: 10, fullName: 'Chris', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Jane', guardianPhone: '215-666-9999'},
            {id: 11, fullName: 'Jane', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Chris', guardianPhone: '215-666-9999'},
            {id: 12, fullName: 'Mary', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Tom', guardianPhone: '215-666-9999'},
            {id: 13, fullName: 'Sam', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Nick', guardianPhone: '215-666-9999'},
            {id: 14, fullName: 'Julie', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Jason', guardianPhone: '215-666-9999'},
            {id: 15, fullName: 'Sarah', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Chuckles', guardianPhone: '215-666-9999'},
            {id: 16, fullName: 'Madeline', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'KJ', guardianPhone: '215-666-9999'},
            {id: 17, fullName: 'Kaley', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Mike', guardianPhone: '215-666-9999'},
            {id: 18, fullName: 'Marykate', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Bill', guardianPhone: '215-666-9999'},
            {id: 19, fullName: 'Ashley', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'John', guardianPhone: '215-666-9999'},
            {id: 20, fullName: 'Linda', email: 'abc@gmail.com', phone: '215-555-0123', guardianName: 'Ali', guardianPhone: '215-666-9999'}
        ]
    }
});