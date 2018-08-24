Ext.define('SlateTasksTeacher.store.StudentTasks', {
    extend: 'Slate.cbl.store.tasks.StudentTasks',


    config: {
        proxy: {
            type: 'slate-cbl-studenttasks',
            relatedTable: [
                {
                    relationship: 'Task',
                    clearOnLoad: true
                }
            ],
        }
    }
});
