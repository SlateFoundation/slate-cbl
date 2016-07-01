Ext.define('Slate.cbl.view.modals.CreateTask', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slate-createtaskwindow',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.view.modals.ModalForm',
        'Slate.cbl.view.modals.WarningWindow',
        'Slate.cbl.widget.SkillsField',
        'Slate.cbl.widget.AssignmentsField',
        'Slate.cbl.store.ParentTasks'
    ],

    title: 'Create Task',

    config: {
        enableAssignments: true
    },

    initComponent: function() {
        var me = this,
            form;

        me.callParent(arguments);
        form = me.down('slate-modalform');

        //check if this form allows assigning
        if (me.getEnableAssignments()) {
            form.insert(5, {xtype: 'slate-tasks-assignmentsfield'});
            form.insert(3, {
                xtype: 'datefield',
                name: 'DueDate',
                fieldLabel: 'Due Date'
            });
        }
    },

    afterRender: function() {
        var me = this;
        me.callParent();

        me.down('#experience-type').addCls('has-warning');
        // me.down('#assigned-to').markInvalid('Foo bar baz qux');
        me.el.on('click', function(ev, t) {
            if (Ext.fly(t).hasCls('slate-field-warning')) {
                Ext.create('Slate.cbl.view.modals.WarningWindow').show();
            }
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
                    fieldLabel: 'Title',
                    name: 'Title',
                    valueField: 'title',
                    listConfig: {
                        cls: 'slate-boundlist'
                    },
                    store: {
                        fields: [ 'title', 'date', 'creator' ],
                        data: [
                            { title: 'Title of Project',                        date: '10/17/15', creator: 'Christian Kunkel' },
                            { title: 'Title of Project with Extra Skill',       date: '10/17/15', creator: 'Christian Kunkel' },
                            { title: 'Title of Project with Two Extra Skills',  date: '10/17/15', creator: 'Christian Kunkel' }
                        ]
                    },
                    tpl: [
                        '<tpl for=".">',
                            '<li class="x-boundlist-item">',
                                '<div class="slate-boundlist-primary"><span class="slate-boundlist-datum slate-boundlist-title">{title}</span></div>',
                                '<div class="slate-boundlist-secondary">',
                                    '<span class="slate-boundlist-datum slate-boundlist-creator">{creator}</span>',
                                    '<span class="slate-boundlist-datum slate-boundlist-date">{date}</span>',
                                '</div>',
                            '</li>',
                        '</tpl>'
                    ],
                    displayTpl: [
                        '<tpl for=".">{title}</tpl>'
                    ]
                },
                {
                    fieldLabel: 'Subtask of',
                    emptyText: '(Optional)',
                    displayField: 'Title',
                    valueField: 'ID',
                    name: 'ParentTaskID',
                    store: 'ParentTasks'
                },
                {
                    itemId: 'experience-type',
                    name: 'ExperienceType',
                    fieldLabel: 'Type of Experience',
                    store: [
                        'Studio',
                        'Flex Time',
                        'Internship'
                    ]
                },
                {
                    xtype: 'datefield',
                    name: 'ExpirationDate',
                    fieldLabel: 'Expiration Date'
                },
                {
                    xtype: 'slate-skillsfield',
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
                    name: 'Instructions',
                    fieldLabel: 'Instructions',
                    grow: true
                }
            ]
        }
    ]
});