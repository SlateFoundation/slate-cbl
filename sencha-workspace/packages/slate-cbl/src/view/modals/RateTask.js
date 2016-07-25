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
                    xtype: 'slate-ratingview'
                },
                {
                    fieldLabel: 'Submitted Date',
                    name: 'Submitted'
                },
                {
                    xtype: 'component',
                    itemId: 'comments-list',
                    tpl: [
                        '<tpl if="values && values.length">',
                            '<div class="slate-task-comments-ct">',
                                '<h4 class="slate-task-comments-heading">Comments</h4>',
                                '<ul class="slate-task-comments">',
                                    '<tpl for=".">',
                                        '<li class="slate-task-comment">',
                                            '<div class="slate-task-comment-date">{[Ext.Date.format(new Date(values.Created * 1000), "M d, Y")]}</div>',
                                            '<div class="slate-task-comment-text">{Message}</div>',
                                        '</li>',
                                    '</tpl>',
                                '</ul>',
                            '</div>',
                        '</tpl>'
                    ]
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





























