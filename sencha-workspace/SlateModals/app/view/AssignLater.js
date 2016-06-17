Ext.define('SlateModals.view.AssignLater', {
    extend: 'SlateModals.view.Modal',
    xtype: 'slate-assignlaterwindow',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'SlateModals.view.ModalForm'
    ],

    title: 'Assign Later',

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
                    xtype: 'button',
                    scale: 'large',
                    text: 'Assign',
                    margin: '0 0 0 16'
                }
            ]
        }
    ],

    items: [
        {
            xtype: 'component',
            margin: '0 0 16',
            html: '<strong>This task was not assigned to Student Name.<br>Click below to assign it.</strong>'
        },
        {
            xtype: 'slate-modalform',
            defaultType: 'displayfield',
            items: [
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
                    cls: 'is-editable',
                    value: '<span class="is-clickable">Workshop</span>'
                },
                {
                    cls: 'is-editable',
                    fieldLabel: 'Due Date',
                    value: '<span class="is-clickable">5/3/15</span>'
                },
                {
                    cls: 'is-editable',
                    fieldLabel: 'Expiration Date',
                    value: '<span class="is-clickable">5/10/15</span>'
                },
                {
                    xtype: 'combo',
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
                                    title: 'Document Name'
                                },
                                {
                                    kind: 'folder',
                                    title: 'Shared Collection Name'
                                }
                            ]
                        }
                    ]
                },
                {
                    fieldLabel: 'Instructions',
                    value: 'Instructions that the teacher has left to students. May vary in length due to project complexity. Instructions that the teacher has left to students. May vary in length due to project complexity.'
                }
            ]
        }
    ]
});