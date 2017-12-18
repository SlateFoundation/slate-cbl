Ext.define('SlateTasksManager.store.ParentTasks', {
    extend: 'Ext.data.Store',


    model: 'Slate.cbl.model.task.Task',
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