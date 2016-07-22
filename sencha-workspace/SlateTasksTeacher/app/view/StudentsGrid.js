/**
 * Renders tasks for a given list of students across a given list of competencies
 */
Ext.define('SlateTasksTeacher.view.StudentsGrid', {
    extend: 'Ext.Component',
    xtype: 'slate-studentsgrid',
    requires:[
    ],

    config: {
        students: [],
        tasks: [],
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
        }
    },

    componentCls: 'slate-studentsgrid',

    tpl: [
        '{% var studentsCount = values.students.length %}',

        '<div class="slate-studentsgrid-rowheaders-ct">',
            '<table class="slate-studentsgrid-rowheaders-table">',
                '<thead>',
                    '<tr>',
                        '<td class="slate-studentsgrid-cornercell">',
                            '&nbsp;',
                        '</td>',
                    '</tr>',
                '</thead>',

                '<tbody>',
                    '<tpl for="rows">',
                        '<tr class="slate-studentsgrid-row',
                            '<tpl if="rows.length"> expandable</tpl>',
                        '">',
                            '<th class="slate-studentsgrid-rowheader',
                                '<tpl if="rows.length"> expandable</tpl>',
                            ,'">',
                                '<div class="slate-studentsgrid-header-text">{Title}</div>',,
                            '</th>',
                        '</tr>',

                        // expander infrastructure

                    '<tpl if="rows">',
                        '<tr class="slate-studentsgrid-expander">',
                            '<td class="slate-studentsgrid-expander-cell">',
                                '<div class="slate-studentsgrid-expander-ct">',
                                    '<table class="slate-studentsgrid-expander-table">',
                                        '<tbody>',
                                        //
                                            '<tpl for="rows">',
                                                '<tr class="slate-studentsgrid-row slate-studentsgrid-subrow">',
                                                    '<th class="slate-studentsgrid-rowheader">',
                                                        '<span class="slate-studentsgrid-header-text">{Title}</span>',
                                                    '</th>',
                                                '</tr>',
                                            '</tpl>',
                                        //
                                        '</tbody>',
                                    '</table>',
                                '</div>',
                            '</td>',
                        '</tr>',
                    '</tpl>',
                        //
                    '</tpl>',
                '</tbody>',
            '</table>',
        '</div>',

        '<div class="slate-studentsgrid-scroller">',
            '<div class="slate-studentsgrid-data-ct">',
                '<div tabindex="0" class="slate-studentsgrid-scroll-control is-disabled scroll-left"></div>',
                '<div tabindex="0" class="slate-studentsgrid-scroll-control is-disabled scroll-right"></div>',

                '<table class="slate-studentsgrid-data-table">',
                    '<thead>',
                        '<tr>',
                            '<tpl for="students">',
                                '<th class="slate-studentsgrid-colheader">',
                                    '<div class="slate-studentsgrid-header-clip">',
                                        '<a class="slate-studentsgrid-header-link" href="javascript:void(0)">',
                                            '<span class="slate-studentsgrid-header-text">{FullName}</span>',
                                        '</a>',
                                    '</div>',
                                '</th>',
                            '</tpl>',
                        '</tr>',
                    '</thead>',

                    '<tbody>',
                        '<tpl for="rows">',
                            '<tr class="slate-studentsgrid-row" data-id="{ID}">',
                                '<tpl for="students">',
                                    '<td class="slate-studentsgrid-cell {cls}" data-id="{ID}" data-task-id="{TaskID}">{[this.showDueDate(values)]}</td>',
                                '</tpl>',
                            '</tr>',

                            // expander infrastructure
                            '<tr class="slate-studentsgrid-expander">',
                                '<td class="slate-studentsgrid-expander-cell" colspan="{[ studentsCount ]}">',
                                    '<div class="slate-studentsgrid-expander-ct">',
                                        '<table class="slate-studentsgrid-expander-table">',
                                            '<tbody>',
                                            //
                                            '<tpl if="rows">',
                                                '<tpl for="rows" >',
                                                    '<tr class="slate-studentsgrid-row slate-studentsgrid-subrow" data-id="{ID}">',
                                                        '<tpl for="students">',
                                                            '<td class="slate-studentsgrid-cell {cls}" data-id="{ID}" data-task-id="{TaskID}" data-parent-task-id="{[parent.ParentTaskID]}">{[this.showDueDate(values)]}</td>',
                                                        '</tpl>',
                                                    '</tr>',
                                                '</tpl>',
                                            '</tpl>',
                                            //
                                            '</tbody>',
                                        '</table>',
                                    '</div>',
                                '</td>',
                            '</tr>',
                            //
                        '</tpl>',
                    '</tbody>',
                '</table>',
            '</div>',
        '</div>',
        {
            showDueDate: function(values) {
                var date = '';

                if (values.TaskStatus == 'completed') {
                    date = '<i class="fa fa-lg fa-check-circle-o"></i>';
                } else if (values.DueDate) {
                    date = Ext.Date.format(new Date(values.DueDate * 1000), 'm/d');
                }

                return date;
            }
        }
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onGridClick',
            element: 'el',
            delegate: ['.slate-studentsgrid-cell', '.slate-studentsgrid-row']
        }
    },

    // TODO make this much better
    onGridClick: function(ev, t) {
        var target = Ext.get(t),
            rowSelector = '.slate-studentsgrid-row',
            subRowSelector = '.slate-studentsgrid-subrow',
            cellSelector = '.slate-studentsgrid-cell';



        if (target.is(cellSelector)) {
            this.onDataCellClick(target);
        } else if (target.is(subRowSelector)) {

        } else if (target.is(rowSelector)) {
            var grid            = this.el,
                rowheadersTable = grid.down('.slate-studentsgrid-rowheaders-table'),
                dataTable       = grid.down('.slate-studentsgrid-data-table'),
                targetTable     = target.up('table'),
                targetTableRows = targetTable.select('.slate-studentsgrid-row'),
                rowIndex = targetTableRows.indexOf(target),
                expandable      = rowheadersTable.select('.slate-studentsgrid-row').item(rowIndex).hasCls('expandable');
            //expand parent tasks
            if (expandable && rowheadersTable.isAncestor(target)) {
                dataTable.select('.slate-studentsgrid-row').item(rowIndex).toggleCls('is-expanded');
                rowheadersTable.select('.slate-studentsgrid-row').item(rowIndex).toggleCls('is-expanded');
            }
        }
    },

    onDataCellClick: function(target) {
        this.fireEvent('datacellclick', this, target);
    },

    applyStudents: function(students) {
        return Ext.Array.map(students, function(r) {
            return r.isModel ? r.getData() : r;
        });
    },

    applyTasks: function(tasks) {
        var me = this,
            statusClasses = me.getStatusClasses(),
            rows = [],
            rowIds = [],
            students = this.getStudents(),
            taskData,
            date = new Date(),
            isLate,
            time = (date.getTime() / 1000),
            _applyStudentTasksData = function(taskObj) {
                var studentSubtaskIds = {},
                    studentTaskCells = [];

                Ext.Array.each(taskObj.StudentTasks, function(studentTask) {
                    isLate = ['assigned', 're-assigned', 'submitted', 're-submitted'].indexOf(studentTask.TaskStatus) > -1 && studentTask.DueDate < time;
                    studentTask.cls = isLate ? statusClasses.late[studentTask.TaskStatus] : statusClasses[studentTask.TaskStatus];
                    studentSubtaskIds[studentTask.StudentID] = studentTask;
                });

                Ext.each(students, function(student) {
                    if (studentSubtaskIds.hasOwnProperty(student.ID)) {
                        studentTaskCells.push(studentSubtaskIds[student.ID]);
                    } else {
                        studentTaskCells.push({
                            text: '',
                            TaskID: taskObj.ID,
                            cls: statusClasses.unassigned
                        });
                    }
                });

                taskObj["students"] = studentTaskCells;
            };

        Ext.each(tasks, function(r) {
            taskData = r.isModel ? r.getData() : r;
            taskData.rows = taskData.SubTasks;
            delete taskData.SubTasks;

            _applyStudentTasksData(taskData);

            Ext.each(taskData.rows, function(row) {
                _applyStudentTasksData(row);
            });
            rows.push(taskData);
        });
        return rows;
    },

    syncData: function() {
        return this.update({
            students: this.getStudents(),
            rows: this.getTasks()
        });
    }
});