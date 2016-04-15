StartTest(function(t){
    t.requireOk('Jarvus.aggregrid.Aggregrid', function () {

        var refreshCount = 0,
            AggregridView = Ext.create('Jarvus.aggregrid.Aggregrid', {
                columnHeaderTpl: [
                    '{fullName}',
                    '<tpl if="rank">',
                        ' ({rank})',
                    '</tpl>'
                ],
                rowHeaderField: 'taskName',
                listeners: {
                    refresh: function() {
                        refreshCount++;
                    }
                }
            });

        t.is(AggregridView.getColumnsStore(), null, 'no default columns store');
        t.is(AggregridView.getRowsStore(), null, 'no default rows store');


        // render grid
        AggregridView.render(Ext.getBody());
        t.is(refreshCount, 0, 'refresh event not fired until stores set');


        // configure columns store
        AggregridView.setColumnsStore({
            fields: ['id', 'fullName'],
            data: [
                {id: 1, fullName: 'Ali', rank: 'Pro'},
                {id: 2, fullName: 'Chris'},
                {id: 3, fullName: 'Ryon'},
                {id: 4, fullName: 'Kevin'},
                {id: 5, fullName: 'Christian'}
            ]
        });

        t.is(AggregridView.getColumnsStore().getCount(), 5, 'columnsStore has 5 records');
        t.is(refreshCount, 0, 'refresh event not fired until both stores set');


        // configure rows store
        AggregridView.setRowsStore({
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
        });

        t.is(AggregridView.getRowsStore().getCount(), 4, 'rowsStore has 4 records');

        t.waitForMs(2000, function() {
            t.is(refreshCount, 1, 'refresh event fired only once during setup');
            t.done();
        });
    });
})