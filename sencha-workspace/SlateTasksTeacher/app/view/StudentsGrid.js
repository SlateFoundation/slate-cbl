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
            '<tpl if="values.records && values.records.length">',
                '{[this.getDisplayValue(values.records)]}',
            '</tpl>',
            {
                getDisplayValue: function(data) {
                    var studentTask = data[data.length - 1]['record'],
                        html = '';

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
            '<tpl if="values.records && values.records.length">',
                '{[this.getDisplayValue(values.records)]}',
            '</tpl>',
            {
                getDisplayValue: function(data) {
                    var studentTask = data[data.length - 1]['record'],
                        html = '';

                    if (studentTask.get('TaskStatus') === 'completed') {
                        html = '<i class="fa fa-lg fa-check-circle-o"></i>';
                    } else if (studentTask.get('DueDate')) {
                        html = Ext.Date.format(studentTask.get('DueDate'), 'm/d');
                    }

                    return html;
                }
            }
        ],

        tpl: [
            '<div class="jarvus-aggregrid-rowheaders-ct">',
                '<table class="jarvus-aggregrid-rowheaders-table">',
                    '<thead>',
                        '<tr>',
                            '<td class="jarvus-aggregrid-cornercell">',
                                '&nbsp;',
                            '</td>',
                        '</tr>',
                    '</thead>',

                    '<tbody>{% values.headerRowsTpl.applyOut(values.rows, out) %}</tbody>',
                '</table>',
            '</div>',

            '<div class="jarvus-aggregrid-scroller">',
                '<div class="jarvus-aggregrid-data-ct">',
                    '<div tabindex="0" class="jarvus-aggregrid-scroll-control is-disabled scroll-left"></div>',
                    '<div tabindex="0" class="jarvus-aggregrid-scroll-control is-disabled scroll-right"></div>',

                    '<table class="jarvus-aggregrid-data-table">',
                        '<thead>',
                            '<tr>',
                                '<tpl for="columns">',
                                    '<th class="jarvus-aggregrid-colheader" data-column-id="{ID}">',
                                        '<div class="jarvus-aggregrid-header-clip">',
                                            '<a class="jarvus-aggregrid-header-link" href="javascript:void(0)">',
                                                '<span class="jarvus-aggregrid-header-text">',
                                                    '{% values.columnHeaderTpl.applyOut(values, out) %}',
                                                '</span>',
                                            '</a>',
                                        '</div>',
                                    '</th>',
                                '</tpl>',
                            '</tr>',
                        '</thead>',

                        '<tbody>{% values.rowsTpl.applyOut(values.rows, out) %}</tbody>',
                    '</table>',
                '</div>',
            '</div>'
        ],

        headerRowsTpl: [
            '<tpl for=".">',
                '<tr class="jarvus-aggregrid-row <tpl if="expandable && SubTasks.length">is-expandable</tpl>" data-row-id="{ID}">',
                    '<th class="jarvus-aggregrid-rowheader">',
                        '<div class="jarvus-aggregrid-header-text">',
                            '{% values.rowHeaderTpl.applyOut(values, out) %}',
                        '</div>',
                    '</th>',
                '</tr>',

                // expander infrastructure
                '<tpl if="expandable">',
                    '<tr class="jarvus-aggregrid-expander" data-row-id="{ID}">',
                        '<td class="jarvus-aggregrid-expander-cell">',
                            '<div class="jarvus-aggregrid-expander-ct"></div>',
                        '</td>',
                    '</tr>',
                '</tpl>',
            '</tpl>'
        ],

        rowsTpl: [
            '<tpl for=".">',
                '<tr class="jarvus-aggregrid-row <tpl if="expandable">is-expandable</tpl>" data-row-id="{ID}">',
                    '<tpl for="columns">',
                        '<td class="jarvus-aggregrid-cell {cls}" data-column-id="{ID}">{Title}</td>',
                    '</tpl>',
                '</tr>',

                // expander infrastructure
                '<tpl if="expandable">',
                    '<tr class="jarvus-aggregrid-expander" data-row-id="{ID}">',
                        '<td class="jarvus-aggregrid-expander-cell" colspan="{columns.length}">',
                            '<div class="jarvus-aggregrid-expander-ct"></div>',
                        '</td>',
                    '</tr>',
                '</tpl>',
            '</tpl>'
        ],

        expanderHeadersTpl: [
            '<table class="jarvus-aggregrid-expander-table">',
                '<tbody>',
                    '<tpl for="subRows">',
                        '<tr class="jarvus-aggregrid-subrow" data-subrow-id="{ID}">',
                            '<th class="jarvus-aggregrid-rowheader">',
                                '<span class="jarvus-aggregrid-header-text">',
                                    '{% values.rowHeaderTpl.applyOut(values, out, parent) %}',
                                '</span>',
                            '</th>',
                        '</tr>',
                    '</tpl>',
                '</tbody>',
            '</table>'
        ],
        expanderBodyTpl: [
            '<table class="jarvus-aggregrid-expander-table">',
                '<tbody>',
                    '<tpl for="subRows">',
                        '<tr class="jarvus-aggregrid-subrow" data-subrow-id="{ID}">',
                            '<tpl for="columns">',
                                '<td class="jarvus-aggregrid-cell {cls}" data-column-id="{ID}">{Title}</td>',
                            '</tpl>',
                        '</tr>',
                    '</tpl>',
                '</tbody>',
            '</table>'
        ],
        subRowHeaderTpl: null,
        rowHeaderTpl: [
            '<tpl for=".">',
                '{Title}',
                '<button class="button small edit-row">Edit</button>',
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