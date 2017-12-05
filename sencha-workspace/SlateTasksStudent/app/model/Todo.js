Ext.define('SlateTasksStudent.model.Todo', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.Todos'
    ],


    // model config
    idProperty: 'ID',

    fields: [
        {
            name: 'ID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: 'Slate\\CBL\\Tasks\\Todo'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'StudentID',
            reference: 'Student',
            type: 'int'
        },
        {
            name: 'SectionID',
            reference: 'Section',
            type: 'int'
        },
        {
            name: 'Description',
            type: 'string'
        },
        {
            name: 'DueDate',
            type: 'date',
            mapping: 'Task.DueDate',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'Completed',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'Cleared',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'DueTime',
            persist: false,
            depends: ['DueDate'],
            convert: function(v, r) {
                var dueDate = r.get('DueDate'),
                    dueTime;

                if (!dueDate) {
                    return null;
                }

                dueTime = new Date(dueDate);

                // task is late after midnight of due date
                dueTime.setHours(23, 59, 59, 999);

                return dueTime;
            }
        }
    ],

    proxy: {
        type: 'slate-cbl-todos'
    }
});