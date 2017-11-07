Ext.define('SlateTasksStudent.view.TaskDetails', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slatetasksstudent-taskdetails',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.widget.AttachmentsField',
        'Slate.cbl.view.modals.ModalForm',
        'Slate.cbl.widget.CommentsField',
        'Slate.cbl.widget.RatingView',
        'Ext.util.Format'
    ],

    modal: true,

    title: 'Task',

    dockedItems: [{
        dock: 'bottom',
        xtype: 'container',
        cls: 'slate-modalfooter',
        items: [{
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'button',
                itemId: 'submit',
                text: 'Submit',
            }]
        }]
    }],

    items: [{
        xtype: 'slate-modalform',
        defaultType: 'displayfield',
        items: [
        {
            fieldLabel: 'Student',
            name: 'FullName'
        },
        {
            fieldLabel: 'Title',
            name: 'Title'
        },
        {
            fieldLabel: 'Instructions',
            name: 'Instructions'
        },
        {
            fieldLabel: 'Subtask of',
            name: 'ParentTaskTitle'
        },
        {
            fieldLabel: 'Type of Experience',
            name: 'ExperienceType'
        },
        {
            fieldLabel: 'Due Date',
            name: 'DueDate',
            renderer: Ext.util.Format.dateRenderer('m/d/y')
        },
        {
            fieldLabel: 'Expiration Date',
            name: 'ExpirationDate',
            renderer: Ext.util.Format.dateRenderer('m/d/y')
        },
        {
            xtype: 'slate-tasks-attachmentsfield',
            itemId: 'teacher-attachments',
            readOnly: true
        },
        {
            fieldLabel: 'Submitted Date',
            name: 'Submitted',
            renderer: Ext.util.Format.dateRenderer('m/d/y')
        },
        {
            fieldLabel: 'Submissions',
            name: 'Submissions',
            renderer: function(val) {
                var submissionsLength = val.length,
                    submissionsText = '',
                    submissionDate,
                    i = 0;

                for (; i<submissionsLength; i++) {
                    submissionDate = Ext.Date.format(new Date(val[i].Created * 1000), 'm/d/y');
                    submissionsText += '<div>' + submissionDate + '</div>';
                }
                return submissionsText;
            }
        },
        {
            xtype: 'slate-ratingview',
            readOnly: true
        },
        {
            xtype: 'slate-commentsfield',
            fieldLabel: 'Teacher Comments'
        },
        {
            xtype: 'slate-tasks-attachmentsfield',
            itemId: 'student-attachments'
        }]
    }]
});
