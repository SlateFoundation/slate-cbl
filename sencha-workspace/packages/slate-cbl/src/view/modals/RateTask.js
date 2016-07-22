Ext.define('Slate.cbl.view.modals.RateTask', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slate-ratetaskwindow',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.view.modals.ModalForm',
        'Slate.cbl.widget.RatingView'
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
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            text: 'Assign Revision',
                            action: 'reassign'
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
                    fieldLabel: 'Due Date',
                    name: 'DueDate'
                },
                {
                    fieldLabel: 'Expiration Date',
                    name: 'ExpirationDate'
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
                    xtype: 'slate-ratingview',
                    listeners: {
                        rateskill: function() {
                            this.up('slate-ratetaskwindow').fireEvent('rateskill', ...arguments);
                        },
                        removerating: function() {
                            this.up('slate-ratetaskwindow').fireEvent('removerating', ...arguments);
                        }
                    }
                },
                {
                    fieldLabel: 'Submitted Date',
                    name: 'Submitted'
                },
                {
                    xtype: 'textareafield',
                    fieldLabel: 'Comments',
                    name: 'Comment'
                }
            ]
        }
    ]
});





























