/**
 * Renders tasks for a given list of students across a given list of competencies
 */
Ext.define('SlateTasksTeacher.view.StudentsGrid', function() {
    var prefixTaskCls = function(cls) {
        return 'slate-task-status-'+cls;
    };

    return {
        extend: 'Jarvus.aggregrid.RollupAggregrid',
        xtype: 'slate-studentsgrid',
        requires: [
            'Ext.data.ChainedStore',

            /* global Slate */
            'Slate.cbl.model.tasks.StudentTask'
        ],


        config: {
            dateRenderer: 'm/d',

            rowsStore: {
                type: 'chained',
                source: 'Tasks',
                filters: [{
                    property: 'ParentTaskID',
                    value: null
                }],
                sorters: [{
                    sorterFn: function(a, b) {
                        return (
                            a.get('Status') === b.get('Status') ?
                            0 :
                            (
                                a.get('Status') === 'archived' ?
                                1 :
                                -1
                            )
                        )
                    }
                }]
            },
            subRowsStore: 'Tasks',
            columnsStore: 'SectionParticipants',

            dataStore: 'StudentTasks',
            subDataStore: 'StudentTasks',

            columnHeaderField: 'PersonFullName',

            rowHeaderField: null,
            subRowHeaderField: null,
            rowHeaderTpl: [
                '<tpl for=".">',
                    '{Title} <tpl if="Status === \'archived\'">(archived)</tpl>',
                    '<button class="button small edit-row">Edit</button>',
                '</tpl>'
            ],

            columnMapper: function(studentTask, columnsStore) {
                return columnsStore.getByPersonId(studentTask.get('StudentID'));
            },
            rowMapper: 'TaskID',

            subRowMapper: 'TaskID',
            parentRowMapper: 'ParentTaskID',

            // templates
            cellTpl: false,
            cellRenderer: function(group, cellEl) {
                var me = this,
                    oldStatusClass = group.statusClass,
                    record, statusClass, taskStatus, dueDate;

                if (group.records.length && (record = group.records[0].record)) {
                    taskStatus = record.get('TaskStatus');
                    dueDate = record.get('EffectiveDueDate');
                    statusClass = Slate.cbl.model.tasks.StudentTask[record.get('IsLate') ? 'lateStatusClasses' : 'statusClasses'][taskStatus];
                }

                // write class changes
                if (statusClass != oldStatusClass) {
                    if (oldStatusClass) {
                        cellEl.removeCls(oldStatusClass.split(' ').map(prefixTaskCls));
                    }

                    if (statusClass) {
                        cellEl.addCls(statusClass.split(' ').map(prefixTaskCls));
                    }

                    group.statusClass = statusClass;
                }

                // write completed change
                if (taskStatus == 'completed') {
                    if (group.taskStatus != 'completed') {
                        cellEl.setHtml('<i class="fa fa-check"></i>');
                    }
                } else if (dueDate) {
                    dueDate = me.getDateRenderer()(dueDate);

                    if (group.dueDate != dueDate) {
                        cellEl.setHtml(dueDate);
                        group.dueDate = dueDate;
                    }
                } else {
                    cellEl.setHtml('');
                }

                group.taskStatus = taskStatus;
            }
        },


        // config handlers
        applyDateRenderer: function(dateRenderer) {
            if (typeof dateRenderer == 'string') {
                dateRenderer = Ext.util.Format.dateRenderer(dateRenderer);
            }

            return dateRenderer;
        },


        // Aggregrid template methods
        isRowExpandable: function(row) {
            return row.get('ChildTasks').length > 0;
        },

        buildColumnTplData: function() {
            var columnTplData = this.callParent(arguments),
                studentUsername = columnTplData.Person.Username;

            columnTplData.$cls = 'slate-studentsgrid-cell';

            if (studentUsername) {
                columnTplData.$href = (location.pathname.match(/^\/Slate([A-Z][a-z]+)+\/$/) ? '../SlateTasksStudent/' + location.search : Slate.API.buildUrl('/cbl/dashboards/tasks/student')) + '#' + studentUsername + '/all';
            }

            return columnTplData;
        }
    };
});