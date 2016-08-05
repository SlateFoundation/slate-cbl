Ext.define('SlateTasksTeacher.view.TaskAssigner', {
    extend: 'Slate.cbl.view.modals.AssignLater',

    xtype: 'slate-tasks-teacher-taskassigner',

    config: {
        student: null,
        task: null
    },

    updateStudent: function(student) {
        this.down('#informationCmp').update(student.getData());
    },

    updateTask: function(task) {
        var me = this,
            skillsField = me.down('slate-skillsfield'),
            attachmentsField = me.down('slate-tasks-attachmentsfield');
            // titleField = me.down('[name=Title]'),
            // parentField = me.down('[name=ParentTask]'),
            // experienceField = me.down('[name=ExperienceType]');

        skillsField.setReadOnly(true);
        attachmentsField.setReadOnly(true);
        skillsField.setSkills(task.get('Skills'));
        attachmentsField.setAttachments(task.get('Attachments'));
        me.down('slate-modalform').getForm().setValues(task.getData());
    }
});