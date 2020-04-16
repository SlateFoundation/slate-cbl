Ext.define('Slate.cbl.view.tasks.TaskForm', function() {
    var mergeFn = function(newValue, oldValue) {
            if (typeof newValue === 'boolean') {
                newValue = {
                    hidden: !newValue
                };
            }

            return Ext.merge(oldValue ? Ext.Object.chain(oldValue) : {}, newValue);
        },
        applyFn = function(config, instance) {
            return Ext.factory(config, null, instance);
        };

    return {
        extend: 'Slate.ui.form.Panel',
        xtype: 'slate-cbl-tasks-taskform',
        requires: [
            'Ext.form.field.Display',
            'Ext.form.field.Date',
            'Ext.form.field.Checkbox',
            'Ext.form.field.Text',
            'Ext.form.field.TextArea',
            'Ext.form.FieldSet',

            'Jarvus.store.FieldValuesStore',

            'Emergence.proxy.Values',

            'Slate.cbl.field.TaskSelector',
            'Slate.cbl.field.ClearableSelector',
            'Slate.cbl.field.SkillsSelector',
            'Slate.cbl.field.AssigneesField',
            'Slate.cbl.field.attachments.Field'
        ],


        config: {
            task: null,

            clonedTaskField: {
                merge: mergeFn,
                $value: {
                    name: 'ClonedTaskID',

                    xtype: 'slate-cbl-taskselector',
                    fieldLabel: 'Cloned Task',
                    emptyText: 'Select an existing task to copy from it',
                    allowBlank: true
                }
            },
            clonedTaskDisplayField: {
                merge: mergeFn,
                $value: {
                    name: 'ClonedTask',

                    xtype: 'displayfield',
                    fieldLabel: 'Cloned From',
                    renderer: function(value) {
                        return value ? Ext.String.format('#{0}: {1}', value.ID, value.Title) : '&mdash;';
                    }
                }
            },
            sectionField: {
                merge: mergeFn,
                $value: {
                    name: 'Section',

                    xtype: 'displayfield',
                    fieldLabel: 'Section',
                    renderer: function(value) {
                        return value && value.Title || '&mdash;';
                    }
                }
            },
            titleField: {
                merge: mergeFn,
                $value: {
                    name: 'Title',

                    xtype: 'textfield',
                    fieldLabel: 'Title'
                }
            },
            parentTaskField: {
                merge: mergeFn,
                $value: {
                    name: 'ParentTaskID',

                    xtype: 'slate-cbl-taskselector',
                    fieldLabel: 'Subtask of',
                    emptyText: '(Optional)',
                    queryMode: 'local',
                    anyMatch: true,
                    allowBlank: true
                }
            },
            experienceTypeField: {
                merge: mergeFn,
                $value: {
                    name: 'ExperienceType',

                    xtype: 'slate-cbl-clearableselector',
                    fieldLabel: 'Type of Experience',
                    displayField: 'value',
                    valueField: 'value',
                    allowBlank: false,
                    autoSelect: false,
                    queryMode: 'local',
                    store: {
                        fields: ['value'],
                        pageSize: 0,
                        proxy: {
                            type: 'emergence-values',
                            url: '/cbl/tasks/*experience-types'
                        }
                    }
                }
            },
            dueDateField: {
                merge: mergeFn,
                $value: {
                    name: 'DueDate',

                    xtype: 'datefield',
                    fieldLabel: 'Due Date',
                    allowBlank: true
                }
            },
            expirationDateField: {
                merge: mergeFn,
                $value: {
                    name: 'ExpirationDate',

                    xtype: 'datefield',
                    fieldLabel: 'Expiration Date',
                    allowBlank: true
                }
            },
            assignmentsField: {
                merge: mergeFn,
                $value: {
                    name: 'Assignees',

                    xtype: 'slate-cbl-assigneesfield',
                    allowBlank: false
                }
            },
            skillsSelectorField: {
                merge: mergeFn,
                $value: {
                    name: 'Skills',

                    xtype: 'slate-cbl-skillsselector',
                    selectOnFocus: false,
                    allowBlank: true
                }
            },
            attachmentsField: {
                merge: mergeFn,
                $value: {
                    name: 'Attachments',

                    xtype: 'slate-cbl-attachmentsfield'
                }
            },
            instructionsField: {
                merge: mergeFn,
                $value: {
                    flex: 1,
                    name: 'Instructions',

                    xtype: 'textareafield',
                    fieldLabel: 'Instructions',
                    allowBlank: true
                    // grow: true,
                    // growMin: 200
                }
            },


            hidden: true,
            title: 'Create Task',
            editTitle: 'Edit Task #{0}: {1}',

            footer: [
                {
                    xtype: 'button',
                    text: 'Archive Task',
                    scale: 'large',
                    action: 'archive',
                    margin: '0 0 0 16',
                    hidden: true,
                    reference: 'archiveTask'
                },
                {
                    xtype: 'button',
                    text: 'Un-Archive Task',
                    scale: 'large',
                    action: 'un-archive',
                    margin: '0 0 0 16',
                    hidden: true,
                    reference: 'unarchiveTask'
                },
                {
                    name: 'Status',

                    xtype: 'checkboxfield',
                    uncheckedValue: 'private',
                    inputValue: 'shared',
                    boxLabel: 'Share with other teachers'
                },
                {
                    xtype: 'button',
                    text: 'Save Task',
                    scale: 'large',
                    action: 'submit',
                    margin: '0 0 0 16'
                }
            ]
        },


        componentCls: 'slate-cbl-tasks-taskform',


        // config handlers
        updateTask: function(task, oldTask) {
            var me = this;

            Ext.suspendLayouts();

            if (task) {
                me.loadRecord(task);

                if (task.phantom || !task.get('SectionID')) {
                    me.getForm().clearInvalid();
                    me.getFooter().child('[reference=archiveTask]').hide();
                    me.getFooter().child('[reference=unarchiveTask]').hide();
                } else {
                    me.getFooter().child('[reference=archiveTask]')[
                        task.phantom || task.get('Status') === 'archived' ? 'hide' : 'show'
                    ]();
                    me.getFooter().child('[reference=unarchiveTask]')[
                        !task.phantom && task.get('Status') === 'archived' ? 'show' : 'hide'
                    ]();

                }

                me.setTitle(
                    task.phantom
                        ? me.getInitialConfig('title')
                        : Ext.String.format(me.getInitialConfig('editTitle'), task.getId(), task.get('Title'))
                );

                me.getClonedTaskField().setHidden(!task.phantom);
                me.getClonedTaskDisplayField().setHidden(task.phantom);
                me.show();
            } else {
                me.setTitle(null);
                me.hide();
            }

            me.fireEvent('taskchange', me, task, oldTask);
            Ext.resumeLayouts(true);
        },

        applyClonedTaskField: applyFn,
        applyClonedTaskDisplayField: applyFn,
        applySectionField: applyFn,
        applyTitleField: applyFn,
        applyParentTaskField: applyFn,
        applyExperienceTypeField: applyFn,
        applyDueDateField: applyFn,
        applyExpirationDateField: applyFn,
        applyAssignmentsField: applyFn,
        applySkillsSelectorField: applyFn,
        applyAttachmentsField: applyFn,
        applyInstructionsField: applyFn,


        // component lifecycle
        initItems: function() {
            var me = this;

            me.callParent();

            me.insert(0, [
                {
                    xtype: 'fieldset',
                    defaults: Ext.applyIf({
                        anchor: '100%'
                    }, me.defaults),
                    items: [
                        me.getClonedTaskField(),
                        me.getClonedTaskDisplayField()
                    ]
                },
                me.getSectionField(),
                me.getTitleField(),
                me.getParentTaskField(),
                me.getExperienceTypeField(),
                me.getDueDateField(),
                me.getExpirationDateField(),
                me.getAssignmentsField(),
                me.getSkillsSelectorField(),
                me.getAttachmentsField(),
                me.getInstructionsField()
            ]);
        }
    };
});