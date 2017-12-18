/**
 * Renders tasks for a given list of students across a given list of competencies
 */
Ext.define('SlateTasksTeacher.view.StudentsGrid', {
    extend: 'Jarvus.aggregrid.RollupAggregrid',
    xtype: 'slate-studentsgrid',
    requires: [
        'Ext.data.ChainedStore'
    ],

    config: {
        rowsStore: {
            type: 'chained',
            source: 'Tasks',
            filters: [{
                property: 'ParentTaskID',
                value: null
            }]
        },
        subRowsStore: 'Tasks',
        columnsStore: 'SectionParticipants',

        dataStore: 'StudentTasks',
        subDataStore: 'StudentTasks',

        columnHeaderTpl: '{Person.FirstName} {Person.LastName}',
        rowHeaderField: 'Title',
        subRowHeaderField: 'Title',

        columnMapper: 'StudentID',
        rowMapper: 'TaskID',

        subRowMapper: 'TaskID',
        parentRowMapper: 'ParentTaskID',

        statusClasses: {
            unassigned: 'slate-task-status-notassigned',

            assigned: 'slate-task-status-due',
            're-assigned': 'slate-task-status-revision',

            submitted: 'slate-task-status-due slate-task-status-needsrated',
            're-submitted': 'slate-task-status-revision slate-task-status-needsrated',

            late: {
                submitted: 'slate-task-status-late slate-task-status-needsrated',
                're-submitted': 'slate-task-status-late slate-task-status-needsrated',

                assigned: 'slate-task-status-late',
                're-assigned': 'slate-task-status-late'
            },

            completed: 'slate-task-status-completed'
        },

        // templates
        cellTpl: [
            '<tpl if="values.records && values.records[0]">',
            '    {[this.getDisplayValue(values.records[0].record)]}',
            '</tpl>',
            {
                getDisplayValue: function(studentTask) {
                    var html = '';

                    if (studentTask.get('TaskStatus') === 'completed') {
                        html = '<i class="fa fa-lg fa-check-circle-o"></i>';
                    } else if (studentTask.get('DueDate')) {
                        html = Ext.Date.format(studentTask.get('DueDate'), 'm/d');
                    }

                    return html;
                }
            }
        ],

        subCellTpl: [
            '<tpl if="values.records && values.records[0]">',
            '    {[this.getDisplayValue(values.records[0].record)]}',
            '</tpl>',
            {
                getDisplayValue: function(studentTask) {
                    var html = '';

                    if (studentTask.get('TaskStatus') === 'completed') {
                        html = '<i class="fa fa-lg fa-check-circle-o"></i>';
                    } else if (studentTask.get('DueDate')) {
                        html = Ext.Date.format(studentTask.get('DueDate'), 'm/d');
                    }

                    return html;
                }
            }
        ],

        subRowHeaderTpl: null,

        rowHeaderTpl: [
            '<tpl for=".">',
            '    {Title}',
            '    <button class="button small edit-row">Edit</button>',
            '</tpl>'
        ]
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);
        me.setConfig({
            cellRenderer: me.cellRenderFn,
            subCellRenderer: me.cellRenderFn
        });
    },

    cellRenderFn: function(group, cellEl) {
        var me = this,
            activeStatuses = [
                'assigned',
                're-assigned',
                'submitted',
                're-submitted'
            ],
            cellClasses = ['jarvus-aggregrid-cell', 'slate-studentsgrid-cell'],
            statusClasses = me.getStatusClasses(),
            record,
            dueDate, endOfDueDate, status,
            now, isLate;

        if (group.records && group.records.length && (record = group.records[0].record)) {
            dueDate = record.get('DueDate');
            status = record.get('TaskStatus');

            if (dueDate) {
                now = new Date();
                endOfDueDate = new Date(dueDate);

                // task is late after midnight of due date
                endOfDueDate.setHours(23);
                endOfDueDate.setMinutes(59);
                endOfDueDate.setSeconds(59);

                isLate = activeStatuses.indexOf(status) > -1 && endOfDueDate < now;
            }

            if (isLate) {
                cellClasses.push(statusClasses.late[status] || '');
            }

            cellClasses.push(statusClasses[status] || statusClasses.assigned);
        }

        cellEl.dom.className = cellClasses.join(' ');
        me.cellTpl.overwrite(cellEl, group);
    }
});