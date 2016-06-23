Ext.define('Slate.cbl.view.modals.CreateTask', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slate-createtaskwindow',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.view.modals.ModalForm',
        'Slate.cbl.view.modals.WarningWindow'
    ],

    title: 'Create Task',

    afterRender: function() {
        var me = this;
        me.callParent();

        me.down('#experience-type').addCls('has-warning');
        me.down('#assigned-to').markInvalid('Foo bar baz qux');
        me.el.on('click', function(ev, t) {
            Ext.create('Slate.cbl.view.modals.WarningWindow').show();
        }, {
            delegate: '.slate-field-warning'
        });
    },

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
                    itemId: 'experience-type',
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
                            itemId: 'assigned-to',
                            flex: 1,
                            xtype: 'combo'
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
                                    kind: 'doc',
                                    title: 'Document List Name'
                                },
                                {
                                    kind: 'folder',
                                    title: 'Shared Collection Name'
                                },
                                {
                                    title: 'Generic Item Name'
                                },
                                {
                                    kind: 'image',
                                    title: 'Image Name'
                                }
                            ]
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
                    grow: true
                }
            ]
        }
    ]
});