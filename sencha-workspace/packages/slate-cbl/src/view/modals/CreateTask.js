Ext.define('Slate.cbl.view.modals.CreateTask', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slate-createtaskwindow',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.view.modals.ModalForm',
        'Slate.cbl.view.modals.WarningWindow',
        'Slate.cbl.widget.TaskTitleField',
        'Slate.cbl.widget.SkillsField',
        'Slate.cbl.widget.AssignmentsField',
        'Slate.cbl.widget.AttachmentsField'
    ],

    title: 'Create Task',
    config: {
        task: null,
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
                itemId: 'due-date',
                name: 'DueDate',
                fieldLabel: 'Due Date'
            });
        }
    },

    afterRender: function() {
        var me = this;
        me.callParent();

        // me.down('#experience-type').addCls('has-warning');
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
                    itemId: 'status',
                    inputValue: 'shared',
                    name: 'Status',
                    boxLabel: 'Add task to database'
                },
                {
                    xtype: 'button',
                    scale: 'large',
                    text: 'Create',
                    margin: '0 0 0 16',
                    action: 'save'
                }
            ]
        }
    ],

    items: [
        {
            xtype: 'slate-modalform',
            items: [
                {
                    xtype: 'slate-tasks-titlefield',
                    clonable: true
                },
                {
                    xtype: 'slate-tasks-titlefield',
                    fieldLabel: 'Subtask of',
                    emptyText: '(Optional)',
                    name: 'ParentTaskID',
                    valueField: 'ID',
                    store: {
                        model: 'Slate.cbl.model.Task',
                        autoLoad: true,
                        proxy: {
                            type: 'slate-records',
                            url: '/cbl/tasks',
                            extraParams: {
                                excludeSubtasks: true
                            },
                            include: [
                                'Creator'
                            ]
                        }
                    }
                },
                {
                    itemId: 'experience-type',
                    name: 'ExperienceType',
                    fieldLabel: 'Type of Experience',
                    displayField: 'name',
                    valueField: 'name',
                    allowBlank: true,
                    forceSelection: true,
                    queryParam: 'q',
                    store: {
                        fields: ['name'],
                        pageSize: 0,
                        proxy: {
                            type: 'slate-records',
                            url: '/cbl/tasks/*experience-types'
                        }
                    }
                },
                {
                    xtype: 'datefield',
                    itemId: 'expiration-date',
                    name: 'ExpirationDate',
                    fieldLabel: 'Expiration Date'
                },
                {
                    xtype: 'slate-skillsfield',
                },
                {
                    xtype: 'slate-tasks-attachmentsfield'
                },
                {
                    xtype: 'textareafield',
                    itemId: 'instructions',
                    name: 'Instructions',
                    fieldLabel: 'Instructions',
                    grow: true
                }
            ]
        }
    ]
});