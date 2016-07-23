Ext.define('SlateTasksTeacher.store.Tasks', {
    extend: 'Ext.data.Store',

    model: 'Slate.cbl.model.Task',

    proxy: {
        type: 'slate-records',
        url: '',
        extraParams: {
            excludeSubtasks: true
        },
        include: [
            '*.ParentTaskTitle',
            '*.StudentTasks.SkillRatings',
            '*.Skills.CompetencyCode',
            '*.Skills.CompetencyDescriptor',
            '*.Attachments'
        ]
    }
});