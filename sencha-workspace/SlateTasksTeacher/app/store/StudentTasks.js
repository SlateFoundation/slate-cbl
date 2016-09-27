Ext.define('SlateTasksTeacher.store.StudentTasks', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.Records'
    ],

    model: 'Slate.cbl.model.StudentTask',
    remoteFilter: true,
    remoteSort: true,
    pageSize: 0,

    proxy: {
        type: 'slate-records',
        url: '/cbl/student-tasks',
        include: 'Attachments,Comments,Skills,Student,TaskSkills'
    },

    config: {
        courseSection: null
    },

    updateCourseSection: function(courseSection) {
        var me = this;

        me.getProxy().setExtraParam('course_section', courseSection);

        return me;
    }
});