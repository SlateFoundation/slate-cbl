Ext.define('AggregridExample.view.MyAggregrid', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'app-myaggregrid',


    config: {
        columnsStore: {
            //type: 'store',
            fields: ['id', 'fullName'],
            data: [
                {id: 1, fullName: 'Ali', rank: 'Pro'},
                {id: 2, fullName: 'Chris'},
                {id: 3, fullName: 'Ryon'},
                {id: 4, fullName: 'Kevin'},
                {id: 5, fullName: 'Christian'}
            ]
        },
        columnHeaderTpl: [
            '{fullName}',
            '<tpl if="rank">',
                ' ({rank})',
            '</tpl>'
        ],

        rowsStore: {
            //type: 'store',
            fields: ['id', 'taskName'],
            data: [
                {id: 1, taskName: 'Task 1'},
                {id: 2, taskName: 'Task 2'},
                {
                    id: 3, taskName: 'Task 3',
                    rows: [
                        { taskName: 'Task 3 - Subtask 1'},
                        { taskName: 'Task 3 - Subtask 2'},
                        { taskName: 'Task 3 - Subtask 3'}
                    ]
                },
                {id: 4, taskName: 'Task 4'}
            ]
        },
        rowHeaderField: 'taskName'
    }
});