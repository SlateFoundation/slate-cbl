Ext.define('Slate.cbl.view.modals.RateTask', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slate-ratetaskwindow',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.view.modals.ModalForm',
        'Slate.cbl.widget.RatingView',
        'Slate.cbl.widget.CommentsField',
        'Slate.cbl.widget.ReAssignmentField',
        'Slate.cbl.widget.SubmissionsField'
    ],

    title: 'Rate Task',

    config: {
        task: null,
        studentTask: null,
        demonstration: null
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
                    xtype: 'slate-tasks-attachmentsfield',
                    itemId: 'student-attachments',
                    fieldLabel: 'Student Attachments',
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
                    xtype: 'fieldcontainer',
                    defaults: {
                        flex: 1
                    },
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        itemId: 'reset-ratings-btn',
                        action: 'resetratings',
                        text: 'Reset',
                        hidden: true,
                        disabled: true
                    }, {
                        xtype: 'tbspacer',
                        flex: 4
                    }, {
                        xtype: 'button',
                        itemId: 'save-ratings-btn',
                        action: 'saveratings',
                        text: 'Save',
                        hidden: true,
                        disabled: true
                    }]
                },
                {
                    xtype: 'slate-tasks-submissions'
                },
                {
                    xtype: 'slate-commentsfield'
                },
                {
                    xtype: 'slate-tasks-reassignfield'
                }
            ]
        }
    ]
});