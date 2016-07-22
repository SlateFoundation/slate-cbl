Ext.define('SlateTasksTeacher.store.StudentTasks', {
    extend: 'Ext.data.Store',

    model: 'Slate.cbl.model.Task',

    proxy: {
        type: 'slate-records',
        url: '',
        extraParams: {
            excludeSubtasks: true
        },
        include: [
            '*.StudentTasks.SkillRatings',
            '*.Skills.CompetencyCode',
            '*.Skills.CompetencyDescriptor',
            '*.Attachments'
        ]
    }
});