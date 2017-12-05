Ext.define('Slate.cbl.store.ParentTasks', {
    extend: 'Ext.data.Store',


    model: 'Slate.cbl.model.Task',
    config: {
        proxy: {
            type: 'slate-cbl-tasks',
            extraParams: {
                excludeSubtasks: true
            },
            include: [
                'Creator'
            ]
        }
    }
});