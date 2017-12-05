Ext.define('SlateTasksTeacher.store.Tasks', {
    extend: 'Slate.cbl.store.Tasks',


    config: {
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
        }
    }
});