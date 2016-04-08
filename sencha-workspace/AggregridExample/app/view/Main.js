Ext.define('AggregridExample.view.Main', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'app-main',


    config: {
        columnsStore: {
            //type: 'store',
            fields: ['id', 'name'],
            data: [
                {id: 1, name: 'Ali'},
                {id: 2, name: 'Chris'},
                {id: 3, name: 'Ryon'},
                {id: 4, name: 'Kevin'},
                {id: 5, name: 'Christian'}
            ]
        },
        rowsStore: {
            //type: 'store',
            fields: ['id', 'title'],
            data: [
                {id: 1, title: 'Task 1'},
                {id: 2, title: 'Task 2'},
                {id: 3, title: 'Task 3'},
                {id: 4, title: 'Task 4'}
            ]
        },

    }
});