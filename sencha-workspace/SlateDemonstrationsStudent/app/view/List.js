/**
 * This view is an example list of people.
 */
Ext.define('SlateDemonstrationsStudent.view.List', {
    extend: 'Ext.grid.Panel',
    xtype: 'slate-demonstrations-student-list',

    requires: [
        'SlateDemonstrationsStudent.store.Personnel'
    ],

    title: 'Personnel',

    store: {
        type: 'personnel'
    },

    columns: [
        { text: 'Name',  dataIndex: 'name' },
        { text: 'Email', dataIndex: 'email', flex: 1 },
        { text: 'Phone', dataIndex: 'phone', flex: 1 }
    ]
    
});
