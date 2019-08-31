Ext.define('SlateTasksStudent.store.Tasks', {
    extend: 'Slate.cbl.store.tasks.StudentTasks',


    model: 'Slate.cbl.model.tasks.StudentTask',

    config: {
        remoteSort: false,
        remoteFilter: false,

        sorters: [{
            sorterFn: function(task1, task2) {
                var completed1 = task1.get('TaskStatus') == 'completed',
                    completed2 = task2.get('TaskStatus') == 'completed',
                    date1 = task1.get('EffectiveDueDate'),
                    date2 = task2.get('EffectiveDueDate'),
                    submitted1, submitted2;

                // completed tasks are obsolute last
                // TODO: sort within completed?
                if (completed1 && completed2) {
                    submitted1 = task1.get('Submitted') || date1;
                    submitted2 = task2.get('Submitted') || date2;

                    if (!submitted1) {
                        return 1;
                    }

                    if (!submitted2) {
                        return -1;
                    }

                    return submitted1 > submitted2 ? -1 : submitted1.getTime() == submitted2.getTime() ? 0 : 1; // eslint-disable-line no-nested-ternary
                } else if (completed1) {
                    return 1;
                } else if (completed2) {
                    return -1;
                }

                // tasks without due date are second to last
                if (date1 === null) {
                    return 1;
                } else if (date2 === null) {
                    return -1;
                }

                // finally sort by oldest due date first
                return date1 > date2 ? 1 : date1.getTime() == date2.getTime() ? 0 : -1; // eslint-disable-line no-nested-ternary
            }
        }],

        // redeclare identical proxy as model for dynamic reconfiguration
        proxy: {
            type: 'slate-cbl-studenttasks',
            include: [
                'Submitted',
                'Task.Section'
            ]
        }
    }
});
