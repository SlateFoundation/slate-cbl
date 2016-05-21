Ext.define('Slate.cbl.view.modals.RateTask', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slate-ratetaskwindow',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.view.modals.ModalForm'
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
                            text: 'Unassign Task',
                            margin: '0 0 8'
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
                    value: 'Chris Alfano'
                },
                {
                    fieldLabel: 'Title',
                    value: 'Senior Thesis Project Synopsis'
                },
                {
                    fieldLabel: 'Subtask of',
                    value: 'Senior Thesis'
                },
                {
                    fieldLabel: 'Type of Experience',
                    value: 'Workshop'
                },
                {
                    fieldLabel: 'Due Date',
                    value: '5/3/15'
                },
                {
                    fieldLabel: 'Expiration Date',
                    value: '5/10/15'
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Attachments',
                    items: [
                        {
                            xtype: 'slate-attachmentslist',
                            data: [
                                {
                                    kind: 'googledoc',
                                    title: 'Document Name'
                                },
                                {
                                    kind: 'googlefolder',
                                    title: 'Folder Name'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'tagfield',
                    fieldLabel: 'Skills',
                    emptyText: 'Competency code or statement&hellip;'
                }
            ]
        }
    ]
});





























