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
        columnsStore: 'Students',

        dataStore: 'StudentTasks',
        subDataStore: 'StudentTasks',

        columnHeaderField: 'FullName',
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
                '{[this.getDisplayValue(values.records[0].record)]}',
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
                '{[this.getDisplayValue(values.records[0].record)]}',
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

        cellRenderer: function() {
            return this.cellRenderFn.apply(this, arguments);
        },

        subCellRenderer: function() {
            return this.cellRenderFn.apply(this, arguments);
        }
    },

    cellRenderFn: function(group, cellEl) {
        var me = this,
            statusClasses = me.statusClasses,
            time = new Date().getTime(),
            cellClasses = ['jarvus-aggregrid-cell', 'slate-studentsgrid-cell'],
            isLate, record;

        if (group.records && group.records.length && (record = group.records[0].record)) {
            isLate = ['assigned', 're-assigned', 'submitted', 're-submitted'].indexOf(record.get('TaskStatus')) > -1 && record.get('DueDate') < time;

            cellClasses.push(isLate ? statusClasses.late[record.get('TaskStatus')] : statusClasses[record.get('TaskStatus')]);
        }

        cellEl.dom.className = cellClasses.join(' ');
        me.cellTpl.overwrite(cellEl, group);
    }
});