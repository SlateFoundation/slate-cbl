Ext.define('SlateTasksTeacher.store.StudentTasks', {
    extend: 'Ext.data.Store',


    model: 'Slate.cbl.model.StudentTask',
    config: {
        courseSection: null,

        remoteFilter: true,
        remoteSort: true,
        pageSize: 0,

        // redeclare identical proxy as model for dynamic reconfiguration
        proxy: {
            type: 'slate-cbl-studenttasks',
            include: [
                'Attachments.File',
                'Comments',
                'Skills',
                'Student',
                'TaskSkills',
                'Submissions'
            ]
        },
    },

    // config handlers
    updateCourseSection: function(courseSection) {
        var me = this;

        me.getProxy().setExtraParam('course_section', courseSection);

        return me;
    }
});
