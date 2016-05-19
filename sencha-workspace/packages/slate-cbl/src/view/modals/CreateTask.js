Ext.define('Slate.cbl.view.modals.CreateTask', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slate-createtaskwindow',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.view.modals.ModalForm'
    ],

    title: 'Create Task',

    dockedItems: [
        {
            dock: 'bottom',
            xtype: 'container',
            cls: 'slate-modalfooter',
            layout: {
                type: 'hbox',
                pack: 'end'
            },
            items: [
                {
                    xtype: 'checkboxfield',
                    boxLabel: 'Add task to database'
                },
                {
                    xtype: 'button',
                    scale: 'large',
                    text: 'Create',
                    margin: '0 0 0 16'
                }
            ]
        }
    ],

    items: [
        {
            xtype: 'slate-modalform',
            items: [
                {
                    fieldLabel: 'Title'
                },
                {
                    fieldLabel: 'Subtask of',
                    emptyText: '(Optional)'
                },
                {
                    fieldLabel: 'Type of Experience'
                },
                {
                    xtype: 'datefield',
                    fieldLabel: 'Due Date'
                },
                {
                    xtype: 'datefield',
                    fieldLabel: 'Expiration Date'
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Assigned To',
                    layout: 'hbox',
                    defaults: { margin: 0 },
                    items: [
                        {
                            flex: 1,
                            xtype: 'combo',
                        },
                        {
                            xtype: 'checkboxfield',
                            boxLabel: 'All',
                            margin: '0 0 0 8'
                        }
                    ]
                },
                {
                    fieldLabel: 'Skills',
                    emptyText: 'Competency code or statement&hellip;'
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Attachments',
                    items: [
                        {
                            xtype: 'textfield',
                            emptyText: 'Enter URL',
                            width: '100%'
                        },
                        {
                            xtype: 'slate-attachmentslist',
                            margin: '0 0 8',
                            data: [
                                {
                                    kind: 'googledoc',
                                    title: 'Document List Name'
                                },
                                {
                                    kind: 'googlefolder',
                                    title: 'Shared Collection Name'
                                },
                                {
                                    title: 'Generic Item Name'
                                },
                                {
                                    kind: 'image',
                                    title: 'Image Name'
                                }
                            ],
                        },
                        {
                            xtype: 'button',
                            text: 'Add Link',
                            margin: '0 8 0 0'
                        },
                        {
                            xtype: 'button',
                            text: 'Attachment'
                        }
                    ]
                },
                {
                    xtype: 'textareafield',
                    fieldLabel: 'Instructions',
                    grow: true,
                }
            ]
        }
    ]
});