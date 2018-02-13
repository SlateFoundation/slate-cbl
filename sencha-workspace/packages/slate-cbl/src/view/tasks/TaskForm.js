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
            'Ext.form.field.Checkbox',
            'Ext.form.field.Text',
            'Ext.form.field.TextArea',

            'Jarvus.store.FieldValuesStore',

            'Emergence.proxy.Values',

            'Slate.ui.PanelFooter',

            'Slate.cbl.field.TaskSelector',
            'Slate.cbl.field.ClearableSelector',
            'Slate.cbl.field.SkillsSelector',
            'Slate.cbl.field.AssigneesField',
            'Slate.cbl.widget.AttachmentsField'
        ],


        config: {
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
                    allowBlank: true,
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
                    fieldLabel: 'Due Date'
                }
            },
            expirationDateField: {
                merge: mergeFn,
                $value: {
                    name: 'ExpirationDate',

                    xtype: 'datefield',
                    fieldLabel: 'Expiration Date'
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
                    selectOnFocus: false
                }
            },
            attachmentsField: {
                merge: mergeFn,
                $value: {
                    name: 'Attachments',

                    xtype: 'slate-tasks-attachmentsfield'
                }
            },
            instructionsField: {
                merge: mergeFn,
                $value: {
                    flex: 1,
                    name: 'Instructions',

                    xtype: 'textareafield',
                    fieldLabel: 'Instructions',
                    // grow: true,
                    // growMin: 200
                }
            },


            title: 'Create Task',

            footer: [
                {
                    xtype: 'checkboxfield',
                    name: 'Status',
                    uncheckedValue: 'private',
                    inputValue: 'shared',
                    boxLabel: 'Share with other teachers'
                },
                {
                    xtype: 'button',
                    text: 'Create Task',
                    scale: 'large',
                    action: 'submit',
                    margin: '0 0 0 16'
                }
            ]
        },


        // config handlers
        applyClonedTaskField: applyFn,
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
                me.getClonedTaskField(),
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