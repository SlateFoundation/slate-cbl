Ext.define('Slate.cbl.store.ParentTasks', {
    extend: 'Ext.data.Store',
    requires: [
        // 'Slate.cbl.store.Tasks'
        'Slate.cbl.model.Task'
    ],

    // source: 'Tasks',
    model: 'Slate.cbl.model.Task',
    autoLoad: true,
    proxy: {
        type: 'slate-records',
        url: '/cbl/tasks',
        extraParams: {
            excludeSubtasks: true
        },
        include: [
            'Creator'
        ]
    }
});