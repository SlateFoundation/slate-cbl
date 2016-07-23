Ext.define('Slate.cbl.view.modals.AssignLater', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slate-assignlaterwindow',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.view.modals.ModalForm',
        'Slate.cbl.widget.SkillsField',
        'Slate.cbl.widget.AttachmentsField'
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
                    action: 'assign',
                    margin: '0 0 0 16'
                }
            ]
        }
    ],

    items: [
        {
            xtype: 'component',
            itemId: 'informationCmp',
            margin: '0 0 16',
            tpl: ['<strong>This task was not assigned to {FirstName} {LastName}<br>Click below to assign it.</strong>']
        },
        {
            xtype: 'slate-modalform',
            defaultType: 'displayfield',
            items: [
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
                    xtype: 'textfield',
                    name: 'ExperienceType',
                    readOnly: true,
                    cls: 'is-editable'
                },
                {
                    cls: 'is-editable',
                    xtype: 'datefield',
                    fieldLabel: 'Due Date',
                    name: 'DueDate',
                    submitFormat: 'timestamp'
                },
                {
                    cls: 'is-editable',
                    xtype: 'datefield',
                    fieldLabel: 'Expiration Date',
                    name: 'ExpirationDate'
                },
                {
                    xtype: 'slate-skillsfield',
                    emptyText: 'Competency code or statement&hellip;'
                },
                {
                    xtype: 'slate-tasks-attachmentsfield',
                    readOnly: true
                },
                {
                    fieldLabel: 'Instructions',
                    name: 'Instructions'
                }
            ]
        }
    ]
});