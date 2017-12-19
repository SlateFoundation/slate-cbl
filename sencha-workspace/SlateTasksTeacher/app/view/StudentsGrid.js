/**
 * Renders tasks for a given list of students across a given list of competencies
 */
Ext.define('SlateTasksTeacher.view.StudentsGrid', {
    extend: 'Jarvus.aggregrid.RollupAggregrid',
    xtype: 'slate-studentsgrid',
    requires: [
        'Ext.data.ChainedStore',

        /* global Slate */
        'Slate.cbl.model.tasks.Task'
    ],

    config: {
        dateRenderer: 'm/d',

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

        // templates
        cellTpl: false,
        cellRenderer: function(group, cellEl) {
            var me = this,
                oldStatusClass = group.statusClass,
                record, statusClass, taskStatus, dueDate;

            if (group.records.length && (record = group.records[0].record)) {
                taskStatus = record.get('TaskStatus');
                dueDate = record.get('DueDate');
                statusClass = Slate.cbl.model.tasks.Task[record.get('IsLate') ? 'lateStatusClasses' : 'statusClasses'][taskStatus];
            }

            // write class changes
            if (statusClass != oldStatusClass) {
                if (oldStatusClass) {
                    cellEl.removeCls('slate-task-status-'+oldStatusClass);
                }

                cellEl.addCls('slate-task-status-'+statusClass);
                group.statusClass = statusClass;
            }

            // write completed change
            if (taskStatus == 'completed') {
                if (group.taskStatus != 'completed') {
                    cellEl.setHtml('<i class="fa fa-lg fa-check-circle-o"></i>');
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
        },

        rowHeaderTpl: [
            '<tpl for=".">',
            '    {Title}',
            '    <button class="button small edit-row">Edit</button>',
            '</tpl>'
        ]
    },


    // Aggregrid template methods
    isRowExpandable: function(row) {
        return row.get('ChildTasks').length > 0;
    },

    buildColumnTplData: function() {
        var columnTplData = this.callParent(arguments);

        columnTplData.$cls = 'slate-studentsgrid-cell';

        return columnTplData;
    },


    // config handlers
    applyDateRenderer: function(dateRenderer) {
        if (typeof dateRenderer == 'string') {
            dateRenderer = Ext.util.Format.dateRenderer(dateRenderer);
        }

        return dateRenderer;
    }
});