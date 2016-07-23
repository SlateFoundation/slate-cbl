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
        // skillsField.setSkills(task.get('Skills'));
        attachmentsField.setAttachments(task.get('Attachments'));

        // titleField.setValue(task.get('Title'));
        // parentField.setValue(task.get('ParentTaskTitle'));
        // experienceField.setValue(task.get('ExperienceType'));
        // expirationField.setValue(Ext.Date.format(task.get('ExpirationDate'), 'm/d/y'));
        // instructionsField.setValue(task.get('Instructions'));
        // console.log(task.getData(), 'task data');
        me.down('slate-modalform').getForm().setValues(task.getData());
    }
});