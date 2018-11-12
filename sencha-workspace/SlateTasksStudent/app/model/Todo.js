Ext.define('SlateTasksStudent.model.Todo', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.Todos',
        'Ext.data.identifier.Negative',
        'Ext.data.validator.Range'
    ],


    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [

        // ActiveRecord fields
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
            allowNull: true,
            persist: false
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true,
            persist: false
        },

        // Todo fields
        {
            name: 'StudentID',
            type: 'int'
        },
        {
            name: 'SectionID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Description',
            type: 'string',
            allowNull: true
        },
        {
            name: 'DueDate',
            type: 'date',
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

        // virtual fields
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
        },
        {
            name: 'IsLate',
            persist: false,
            depends: ['DueTime'],
            convert: function (v, r) {
                var dueTime = r.get('DueTime');

                return (
                    dueTime
                    && dueTime.getTime() < Date.now()
                );
            }
        },
    ],

    proxy: 'slate-cbl-todos',

    validators: [
        {
            field: 'StudentID',
            type: 'min',
            min: 1,
            emptyMessage: 'StudentID is required'
        }
    ]
});