Ext.define('SlateTasksTeacher.store.Tasks',{
    extend: 'Slate.cbl.store.Tasks',

    proxy: {
        type: 'slate-records',
        url: '/cbl/tasks',
        include: [
            '*.ParentTaskTitle',
            '*.StudentTasks.SkillRatings',
            'Skills.CompetencyCode',
            'Skills.CompetencyDescriptor',
            'Attachments.File'
        ]
    },
    pageSize: 0,
    autoLoad: false,
    config: {
        courseSection: null
    },

    updateCourseSection: function(courseSection) {
        var me = this;

        me.getProxy().setExtraParam('course_section', courseSection);

        return me;
    }
});