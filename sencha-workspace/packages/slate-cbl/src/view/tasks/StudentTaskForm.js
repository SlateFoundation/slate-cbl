Ext.define('Slate.cbl.view.tasks.StudentTaskForm', function() {
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
        xtype: 'slate-cbl-tasks-studenttaskform',
        requires: [
            'Ext.util.Format',
            'Ext.form.field.Display',
            // 'Ext.form.field.Checkbox',
            // 'Ext.form.field.Text',
            // 'Ext.form.field.TextArea',
            // 'Ext.form.FieldSet',

            // 'Jarvus.store.FieldValuesStore',

            'Emergence.proxy.Values',

            // 'Slate.cbl.field.TaskSelector',
            // 'Slate.cbl.field.ClearableSelector',
            // 'Slate.cbl.field.SkillsSelector',
            // 'Slate.cbl.field.AssigneesField',
            // 'Slate.cbl.field.attachments.Field'
        ],


        config: {
            studentTask: null,

            statusField: {
                merge: mergeFn,
                $value: {
                    name: 'TaskStatus',

                    xtype: 'displayfield',
                    fieldLabel: 'Status',
                    renderer: function(value) {
                        return value || 'not assigned';
                    }
                }
            },
            studentField: {
                merge: mergeFn,
                $value: {
                    name: 'Student',

                    xtype: 'displayfield',
                    fieldLabel: 'Student',
                    renderer: function(value) {
                        return value ? value.FirstName + ' ' + value.LastName : '&mdash;';
                    }
                }
            },
            taskField: {
                merge: mergeFn,
                $value: {
                    name: 'Task',

                    xtype: 'displayfield',
                    fieldLabel: 'Task',
                    renderer: function(value) {
                        return value ? '#'+value.ID + ': ' + value.Title : '&mdash;';
                    }
                }
            },
            parentTaskField: {
                merge: mergeFn,
                $value: {
                    name: 'ParentTask',

                    xtype: 'displayfield',
                    fieldLabel: 'Subtask of',
                    renderer: function(value) {
                        return value ? '#'+value.ID + ': ' + value.Title : '&mdash;';
                    }
                }
            },
            experienceTypeField: {
                merge: mergeFn,
                $value: {
                    name: 'ExperienceType',

                    xtype: 'displayfield',
                    fieldLabel: 'Type of Experience'
                }
            },
            instructionsField: {
                merge: mergeFn,
                $value: {
                    name: 'Instructions',

                    xtype: 'displayfield',
                    fieldLabel: 'Instructions',
                    renderer: function(value) {
                        return Ext.util.Format.nl2br(value);
                    }
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

                    xtype: 'slate-cbl-attachments-field'
                }
            },
            // titleField: {
            //     merge: mergeFn,
            //     $value: {
            //         name: 'Title',

            //         xtype: 'textfield',
            //         fieldLabel: 'Title'
            //     }
            // },
            // parentTaskField: {
            //     merge: mergeFn,
            //     $value: {
            //         name: 'ParentTaskID',

            //         xtype: 'slate-cbl-taskselector',
            //         fieldLabel: 'Subtask of',
            //         emptyText: '(Optional)',
            //         queryMode: 'local',
            //         anyMatch: true,
            //         allowBlank: true
            //     }
            // },
            // experienceTypeField: {
            //     merge: mergeFn,
            //     $value: {
            //         name: 'ExperienceType',

            //         xtype: 'slate-cbl-clearableselector',
            //         fieldLabel: 'Type of Experience',
            //         displayField: 'value',
            //         valueField: 'value',
            //         allowBlank: true,
            //         autoSelect: false,
            //         queryMode: 'local',
            //         store: {
            //             fields: ['value'],
            //             pageSize: 0,
            //             proxy: {
            //                 type: 'emergence-values',
            //                 url: '/cbl/tasks/*experience-types'
            //             }
            //         }
            //     }
            // },
            // dueDateField: {
            //     merge: mergeFn,
            //     $value: {
            //         name: 'DueDate',

            //         xtype: 'datefield',
            //         fieldLabel: 'Due Date'
            //     }
            // },
            // expirationDateField: {
            //     merge: mergeFn,
            //     $value: {
            //         name: 'ExpirationDate',

            //         xtype: 'datefield',
            //         fieldLabel: 'Expiration Date'
            //     }
            // },
            // assignmentsField: {
            //     merge: mergeFn,
            //     $value: {
            //         name: 'Assignees',

            //         xtype: 'slate-cbl-assigneesfield',
            //         allowBlank: false
            //     }
            // },
            // skillsSelectorField: {
            //     merge: mergeFn,
            //     $value: {
            //         name: 'Skills',

            //         xtype: 'slate-cbl-skillsselector',
            //         selectOnFocus: false
            //     }
            // },
            // attachmentsField: {
            //     merge: mergeFn,
            //     $value: {
            //         name: 'Attachments',

            //         xtype: 'slate-cbl-attachments-field'
            //     }
            // },
            // instructionsField: {
            //     merge: mergeFn,
            //     $value: {
            //         flex: 1,
            //         name: 'Instructions',

            //         xtype: 'textareafield',
            //         fieldLabel: 'Instructions',
            //         // grow: true,
            //         // growMin: 200
            //     }
            // },


            hidden: true,
            title: 'Task Assignment',
            editTitle: 'Edit Task Assignment #{0}: {1}',

            footer: [
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


        // config handlers
        updateStudentTask: function(studentTask) {
            var me = this;

            Ext.suspendLayouts();

            if (studentTask) {
                // configure permanent values before loading record
                me.getSkillsSelectorField().setPermanentValues(studentTask.get('InheritedSkills'));

                me.loadRecord(studentTask);

                me.getParentTaskField().setHidden(!studentTask.get('ParentTask'));

                // if (task.phantom) {
                //     me.getForm().clearInvalid();
                // }

                // me.setTitle(
                //     task.phantom
                //         ? me.getInitialConfig('title')
                //         : Ext.String.format(me.getInitialConfig('editTitle'), task.getId(), task.get('Title'))
                // );

                // me.getClonedTaskField().setHidden(!task.phantom);
                // me.getClonedTaskDisplayField().setHidden(task.phantom);

                me.show();
            } else {
                me.setTitle(null);
                me.hide();
            }

            Ext.resumeLayouts(true);
        },

        applyStatusField: applyFn,
        applyStudentField: applyFn,
        applyTaskField: applyFn,
        applyParentTaskField: applyFn,
        applyExperienceTypeField: applyFn,
        applyInstructionsField: applyFn,
        applySkillsSelectorField: applyFn,
        applyAttachmentsField: applyFn,
        // applySectionField: applyFn,
        // applyTitleField: applyFn,
        // applyParentTaskField: applyFn,
        // applyDueDateField: applyFn,
        // applyExpirationDateField: applyFn,
        // applyAssignmentsField: applyFn


        // component lifecycle
        initItems: function() {
            var me = this;

            me.callParent();

            me.insert(0, [
                me.getStatusField(),
                me.getStudentField(),
                me.getTaskField(),
                me.getParentTaskField(),
                me.getExperienceTypeField(),
                me.getInstructionsField(),
                me.getSkillsSelectorField(),
                me.getAttachmentsField(),
                // me.getParentTaskField(),
                // me.getDueDateField(),
                // me.getExpirationDateField(),
                // me.getAssignmentsField(),
            ]);
        }
    };
});