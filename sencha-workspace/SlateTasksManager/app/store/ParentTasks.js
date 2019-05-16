Ext.define('SlateTasksManager.store.ParentTasks', {
    extend: 'Slate.cbl.store.tasks.Tasks',

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