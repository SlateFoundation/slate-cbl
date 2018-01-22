Ext.define('SlateTasksStudent.store.Tasks', {
    extend: 'Ext.data.Store',


    model: 'SlateTasksStudent.model.Task',

    config: {
        student: null,
        section: null,

        pageSize: 0,
        remoteSort: false,

        sorters: [{
            sorterFn: function(task1, task2) {
                var completed1 = task1.get('TaskStatus') == 'completed',
                    completed2 = task2.get('TaskStatus') == 'completed',
                    date1 = task1.get('DueDate'),
                    date2 = task2.get('DueDate'),
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

                    return submitted1 > submitted2 ? -1 : submitted1.getTime() == submitted2.getTime() ? 0 : 1;
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
                return date1 > date2 ? 1 : date1.getTime() == date2.getTime() ? 0 : -1;
            }
        }],

        // redeclare identical proxy as model for dynamic reconfiguration
        proxy: {
            type: 'slate-cbl-studenttasks',
            url: '/cbl/student-tasks/assigned',
            include: [
                'Submitted',
                'Student',
                'Comments',
                'Attachments.File',
                'Submissions',
                'TaskSkills',
                'Task.Attachments.File',
                'Task.ParentTask',
                'Task.Section'
            ]
        }
    },


    // config handlers
    updateStudent: function(student) {
        this.getProxy().setExtraParam('student', student || null);
        this.dirty = true;
    },

    updateSection: function(section) {
        this.getProxy().setExtraParam('course_section', section || null);
        this.dirty = true;
    },


    // member methods
    loadIfDirty: function() {
        if (!this.dirty || this.getStudent() === null || this.getSection() === null) {
            return;
        }

        this.dirty = false;
        this.load();
    }
});