Ext.define('Slate.cbl.view.modals.RateTask', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slate-ratetaskwindow',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.view.modals.ModalForm',
        'Slate.cbl.widget.RatingView',
        'Slate.cbl.widget.ReAssignmentField'
    ],

    title: 'Rate Task',

    config: {
        task: null,
        studentTask: null
    },

    dockedItems: [
        {
            dock: 'bottom',
            xtype: 'container',
            cls: 'slate-modalfooter',
            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'button',
                        scale: 'large'
                    },
                    items: [
                        {
                            text: 'Edit Task',
                            action: 'edit',
                            margin: '0 0 8'
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            text: 'Accept Task',
                            action: 'accept'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'button',
                        scale: 'large'
                    },
                    items: [
                        {
                            text: 'Unassign Task',
                            action: 'unassign'
                        }
                    ]
                }
            ]
        }
    ],

   items: [
        {
            xtype: 'slate-modalform',
            defaultType: 'displayfield',
            items: [
                {
                    fieldLabel: 'Student',
                    name: 'StudentFullName'
                },
                {
                    fieldLabel: 'Title',
                    name: 'Title'
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
                    xtype: 'datefield',
                    fieldLabel: 'Due Date',
                    name: 'DueDate',
                    readOnly: true,
                    format: 'm/d/Y'
                },
                {
                    xtype: 'datefield',
                    fieldLabel: 'Expiration Date',
                    name: 'ExpirationDate',
                    readOnly: true,
                    format: 'm/d/Y'
                },
                {
                    xtype: 'slate-tasks-attachmentsfield',
                    fieldLabel: 'Attachments',
                    readOnly: true
                },
                {
                    xtype: 'slate-skillsfield',
                    fieldLabel: 'Skills'
                },
                {
                    xtype: 'slate-ratingview'
                },
                {
                    xtype: 'datefield',
                    fieldLabel: 'Submitted Date',
                    name: 'Submitted',
                    readOnly: true,
                    format: 'm/d/Y'
                },
                {
                    xtype: 'textareafield',
                    fieldLabel: 'Comments',
                    name: 'Comment'
                },
                {
                    xtype: 'slate-tasks-reassignfield'
                }
            ]
        }
    ]
});