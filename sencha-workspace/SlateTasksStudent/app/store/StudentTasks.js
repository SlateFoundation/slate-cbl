/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.store.StudentTasks', {
    extend: 'Ext.data.Store',

    model: 'SlateTasksStudent.model.StudentTask',

    config: {
        pageSize: 0
    },

    proxy: {
        type: 'slate-records',
        url: '/cbl/student-tasks/assigned',
        include: [
            'Submitted',
            'Student',
            'Section',
            'Comments',
            'Attachments.File',
            'Submissions',
            'TaskSkills',
            'Task.Attachments.File',
            'Task.ParentTask'
        ]
    }
});
