Ext.define('AggregridExample.view.MyAggregrid', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'app-myaggregrid',


    config: {
        columnsStore: {
            //type: 'store',
            fields: ['id', 'fullName'],
            data: [
                {id: 1, fullName: 'Ali'},
                {id: 2, fullName: 'Chris'},
                {id: 3, fullName: 'Ryon'},
                {id: 4, fullName: 'Kevin'},
                {id: 5, fullName: 'Christian'}
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