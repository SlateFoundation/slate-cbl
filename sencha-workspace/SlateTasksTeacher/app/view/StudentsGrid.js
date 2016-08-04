/**
 * Renders tasks for a given list of students across a given list of competencies
 */
Ext.define('SlateTasksTeacher.view.StudentsGrid', {
    extend: 'Jarvus.aggregrid.RollupAggregrid',
    xtype: 'slate-studentsgrid',
    requires:[

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

            assigned: "slate-task-status-due",
            "re-assigned": 'slate-task-status-revision',

            submitted : 'slate-task-status-due slate-task-status-needsrated',
            "re-submitted" : 'slate-task-status-revision slate-task-status-needsrated',

            late: {
                submitted: 'slate-task-status-late slate-task-status-needsrated',
                "re-submitted": 'slate-task-status-late slate-task-status-needsrated',

                assigned: "slate-task-status-late",
                "re-assigned": 'slate-task-status-late'
            },

            completed: 'slate-task-status-completed'
        },


        cellRenderer: function(group, cellEl, rendered) {
            var me = this,
                statusClasses = me.statusClasses,
                time = new Date().getTime(),
                isLate, cellCls;

            if (group.records && group.records.length && (record = group.records[0].record)) {
                isLate = ['assigned', 're-assigned', 'submitted', 're-submitted'].indexOf(record.get('TaskStatus')) > -1 && record.get('DueDate') < time;
                cellCls = isLate ? statusClasses.late[record.get('TaskStatus')] : statusClasses[record.get('TaskStatus')];
                cellEl.dom.className = 'jarvus-aggregrid-cell slate-studentsgrid-cell '+cellCls;
            }

            me.cellTpl.overwrite(cellEl, group);
        },

        subCellRenderer: function(group, cellEl, rendered) {
            var me = this,
                statusClasses = me.statusClasses,
                time = new Date().getTime(),
                isLate, cellCls;

            if (group.records && group.records.length && (record = group.records[0].record)) {
                isLate = ['assigned', 're-assigned', 'submitted', 're-submitted'].indexOf(record.get('TaskStatus')) > -1 && record.get('DueDate') < time;
                cellCls = isLate ? statusClasses.late[record.get('TaskStatus')] : statusClasses[record.get('TaskStatus')];
                cellEl.dom.className = 'jarvus-aggregrid-cell slate-studentsgrid-cell '+cellCls;
            }

            me.subCellTpl.overwrite(cellEl, group);
        },

        //templates
        cellTpl: [
            '<tpl if="values.records && values.records[0]">',
                '{[this.getDisplayValue(values.records[0].record)]}',
            '</tpl>',
            {
                getDisplayValue: function(studentTask) {
                    var html = '';

                    if (studentTask.get('TaskStatus') == 'completed') {
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

                    if (studentTask.get('TaskStatus') == 'completed') {
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
                '<tr class="jarvus-aggregrid-row <tpl if="expandable">is-expandable</tpl>" data-row-id="{ID}">',
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
        ]
    }
});