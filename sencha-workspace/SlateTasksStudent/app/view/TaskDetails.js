Ext.define('SlateTasksStudent.view.TaskDetails', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slate-taskdetails',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.view.modals.ModalForm',
        'Slate.cbl.widget.RatingView'
    ],

    title: 'Rate Task',

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
                            margin: '0 0 8'
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            text: 'Accept Task'
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
                            text: 'Unassign Task'
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            text: 'Assign Revision'
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
                    name: 'FullName'
                },
                {
                    fieldLabel: 'Title',
                    name: 'Title'
                },
                {
                    fieldLabel: 'Subtask of',
                    name: 'ParentTask'
                },
                {
                    fieldLabel: 'Type of Experience',
                    value: 'Workshop'
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
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Attachments',
                    items: [
                        {
                            xtype: 'slate-attachmentslist',
                            data: [
                                {
                                    kind: 'doc',
                                    title: 'Document Name'
                                },
                                {
                                    kind: 'folder',
                                    title: 'Folder Name'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'slate-ratingview'
                },
                {
                    fieldLabel: 'Submitted Date',
                    value: '5/9/15'
                },
                {
                    xtype: 'textareafield',
                    fieldLabel: 'Comments'
                }
            ]
        }
    ]
});
