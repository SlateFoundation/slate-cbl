Ext.define('SlateTasksTeacher.view.tasks.AttachmentConfirmation', {
    extend: 'Ext.window.MessageBox',
    xtype: 'slate-tasks-attachmentconfirmation',


    title: 'Warning',
    message: 'Publishing this task will share the attached Google Documents with all assignees and course instructors. This <strong>can not</strong> be undone.',
    bbar: [{
        xtype: 'checkboxfield',
        fieldLabel: 'Don\'t show again',
        name: 'NeverShow',
        flex: 1
    }]
});