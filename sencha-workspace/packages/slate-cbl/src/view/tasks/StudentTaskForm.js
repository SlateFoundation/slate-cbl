Ext.define('Slate.cbl.view.tasks.StudentTaskForm', function() {
    var mergeFn = function(newValue, oldValue) {
            if (typeof newValue === 'boolean') {
                newValue = {
                    hidden: !newValue
                };
            } else if (typeof newValue === 'string') {
                newValue = {
                    text: newValue,
                    hidden: false
                };
            }

            return Ext.merge(oldValue ? Ext.Object.chain(oldValue) : {}, newValue);
        },
        applyFn = function(config, instance) {
            if (typeof config === 'boolean') {
                config = {
                    hidden: !config
                };
            } else if (typeof config === 'string') {
                config = {
                    text: config,
                    hidden: false
                };
            }

            return Ext.factory(config, null, instance);
        };

    return {
        extend: 'Slate.ui.form.Panel',
        xtype: 'slate-cbl-tasks-studenttaskform',
        requires: [
            'Ext.util.Format',
            'Ext.form.field.Display',
            'Ext.form.field.Date',
            'Ext.form.field.Checkbox',
            'Ext.form.FieldContainer',

            'Emergence.proxy.Values',

            'Slate.cbl.field.ratings.SkillsField',
            'Slate.cbl.field.attachments.Field'
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
                    name: 'TaskExperienceType',

                    xtype: 'displayfield',
                    fieldLabel: 'Type of Experience'
                }
            },
            instructionsField: {
                merge: mergeFn,
                $value: {
                    name: 'TaskInstructions',

                    xtype: 'displayfield',
                    fieldLabel: 'Instructions',
                    renderer: function(value) {
                        return Ext.util.Format.nl2br(value);
                    }
                }
            },

            dueDateField: {
                merge: mergeFn,
                $value: {
                    name: 'DueDate',

                    xtype: 'datefield',
                    hidden: true,
                    emptyText: 'none'
                }
            },
            dueDateDisplayField: {
                merge: mergeFn,
                $value: {
                    name: 'EffectiveDueDate',

                    xtype: 'displayfield',
                    hidden: true,
                    renderer: function(v) {
                        return v ? Ext.util.Format.date(v, 'Y-m-d') : 'none';
                    }
                }
            },
            dueDateOverrideField: {
                merge: mergeFn,
                $value: {
                    xtype: 'checkbox',
                    boxLabel: 'Override',
                    submitValue: false,
                    excludeForm: true // exclude from any parent forms
                }
            },

            expirationDateField: {
                merge: mergeFn,
                $value: {
                    name: 'ExpirationDate',

                    xtype: 'datefield',
                    hidden: true,
                    emptyText: 'none'
                }
            },
            expirationDateDisplayField: {
                merge: mergeFn,
                $value: {
                    name: 'EffectiveExpirationDate',

                    xtype: 'displayfield',
                    hidden: true,
                    renderer: function(v) {
                        return v ? Ext.util.Format.date(v, 'Y-m-d') : 'none';
                    }
                }
            },
            expirationDateOverrideField: {
                merge: mergeFn,
                $value: {
                    xtype: 'checkbox',
                    boxLabel: 'Override',
                    submitValue: false,
                    excludeForm: true // exclude from any parent forms
                }
            },

            taskAttachmentsField: {
                merge: mergeFn,
                $value: {
                    name: 'TaskAttachments',

                    xtype: 'slate-cbl-attachments-field',
                    readOnly: true
                }
            },
            ratingsField: {
                merge: mergeFn,
                $value: {
                    name: 'DemonstrationSkills',

                    xtype: 'slate-cbl-ratings-skillsfield',
                    fieldLabel: 'Ratings',
                    labelAlign: 'top',
                    allowBlank: true
                }
            },

            saveBtn: {
                merge: mergeFn,
                $value: {
                    xtype: 'button',
                    text: 'Save Assignment',
                    scale: 'large',
                    action: 'submit',
                    margin: '0 0 0 16'
                }
            },

            submitBtn: {
                merge: mergeFn,
                $value: {
                    xtype: 'button',
                    text: 'Submit Assignment',
                    scale: 'large',
                    action: 'submit',
                    margin: '0 0 0 16'
                }
            },

            hidden: true,
            title: null,
            createTitle: 'Assign to {0} {1}: {2}',
            editTitle: 'Rate for {0} {1}: {2}',
            viewTitle: '{2} ―{0} {1}'
        },


        componentCls: 'slate-cbl-tasks-studenttaskform',


        // config handlers
        updateStudentTask: function(studentTask, oldStudentTask) {
            var me = this,
                ratingsField = me.getRatingsField(),
                dueDateField = me.getDueDateField(),
                dueDateOverrideField = me.getDueDateOverrideField(),
                expirationDateField = me.getExpirationDateField(),
                expirationDateOverrideField = me.getExpirationDateOverrideField(),
                availableActions, canEdit, canRate,
                studentData, dueDate, expirationDate;

            Ext.suspendLayouts();

            if (studentTask) {
                availableActions = studentTask.get('availableActions');
                canEdit = studentTask.phantom ? availableActions.create : availableActions.update;
                canRate = availableActions.rate;

                studentData = studentTask.get('Student');
                dueDate = studentTask.get('DueDate');
                expirationDate = studentTask.get('ExpirationDate');

                me.setTitle(Ext.String.format(
                    // eslint-disable-next-line no-nested-ternary
                    canEdit
                        ? studentTask.phantom
                            ? me.getInitialConfig('createTitle')
                            : me.getInitialConfig('editTitle')
                        : me.getInitialConfig('viewTitle'),
                    studentData.FirstName,
                    studentData.LastName,
                    studentTask.get('TaskTitle')
                ));

                me.getParentTaskField().setHidden(!studentTask.get('ParentTask'));

                me.setInstructionsField(Boolean(studentTask.get('TaskInstructions')));

                ratingsField.setSelectedStudent(studentTask.get('Student').Username);
                ratingsField.setHidden(!canRate && !studentTask.get('DemonstrationSkills').length);
                ratingsField.setReadOnly(!canRate);

                me.getDueDateDisplayField().setHidden(dueDate && canEdit);
                dueDateField.setHidden(!dueDate || !canEdit);
                dueDateOverrideField.setHidden(!canEdit);
                dueDateOverrideField.setValue(canEdit ? Boolean(dueDate) : null);
                me.dueDateCt.setHidden(!canEdit && !studentTask.get('EffectiveDueDate'));


                me.getExpirationDateDisplayField().setHidden(expirationDate && canEdit);
                expirationDateField.setHidden(!expirationDate || !canEdit);
                expirationDateOverrideField.setHidden(!canEdit);
                expirationDateOverrideField.setValue(canEdit ? Boolean(expirationDate) : null);
                me.expirationDateCt.setHidden(!canEdit && !studentTask.get('EffectiveExpirationDate'));

                me.setTaskAttachmentsField(studentTask.get('TaskAttachments').length > 0);

                me.setSaveBtn(
                    // eslint-disable-next-line no-nested-ternary
                    canEdit
                        ? studentTask.phantom
                            ? 'Assign Task'
                            : 'Save Assignment'
                        :  false
                );

                me.setSubmitBtn(
                    // eslint-disable-next-line no-nested-ternary
                    availableActions.submit
                        ? 'Submit Assignment'
                        : availableActions.resubmit
                            ? 'Resubmit Assignment'
                            : false
                );


                me.loadRecord(studentTask);
                me.show();
            } else {
                me.setTitle(null);
                me.hide();
            }

            me.fireEvent('studenttaskchange', me, studentTask, oldStudentTask);
            Ext.resumeLayouts(true);
        },

        applyStatusField: applyFn,
        applyStudentField: applyFn,
        applyTaskField: applyFn,
        applyParentTaskField: applyFn,
        applyExperienceTypeField: applyFn,
        applyInstructionsField: applyFn,

        applyDueDateField: applyFn,
        applyDueDateDisplayField: applyFn,
        updateDueDateDisplayField: function(field) {
            var me = this;

            field.on('render', function() {
                field.mon(field.inputEl, 'click', function() {
                    me.getDueDateOverrideField().setValue(true);
                    me.getDueDateField().focus(true, 100);
                });
            });
        },
        applyDueDateOverrideField: applyFn,
        updateDueDateOverrideField: function(field) {
            var me = this;

            field.on('change', function(overrideField, checked) {
                var studentTask = me.getStudentTask(),
                    dateField = me.getDueDateField(),
                    value = checked ? studentTask.get('InheritedDueDate') : null;

                dateField.setValue(value);
                dateField.setHidden(!checked);
                me.getDueDateDisplayField().setHidden(checked);
            });
        },

        applyExpirationDateField: applyFn,
        applyExpirationDateDisplayField: applyFn,
        updateExpirationDateDisplayField: function(field) {
            var me = this;

            field.on('render', function() {
                field.mon(field.inputEl, 'click', function() {
                    me.getExpirationDateOverrideField().setValue(true);
                    me.getExpirationDateField().focus(true, 100);
                });
            });
        },
        applyExpirationDateOverrideField: applyFn,
        updateExpirationDateOverrideField: function(field) {
            var me = this;

            field.on('change', function(overrideField, checked) {
                var studentTask = me.getStudentTask(),
                    dateField = me.getExpirationDateField(),
                    value = checked ? studentTask.get('InheritedExpirationDate') : null;

                dateField.setValue(value);
                dateField.setHidden(!checked);
                me.getExpirationDateDisplayField().setHidden(checked);
            });
        },

        applyTaskAttachmentsField: applyFn,
        applyRatingsField: applyFn,

        applySaveBtn: applyFn,
        applySubmitBtn: applyFn,


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
                {
                    itemId: 'dueDateCt',
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Due Date',
                    layout: 'hbox',
                    items: [
                        me.getDueDateField(),
                        me.getDueDateDisplayField(),
                        {
                            xtype: 'component',
                            flex: 1
                        },
                        me.getDueDateOverrideField()
                    ]
                },
                {
                    itemId: 'expirationDateCt',
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Expiration Date',
                    layout: 'hbox',
                    items: [
                        me.getExpirationDateField(),
                        me.getExpirationDateDisplayField(),
                        {
                            xtype: 'component',
                            flex: 1
                        },
                        me.getExpirationDateOverrideField()
                    ]
                },
                me.getTaskAttachmentsField(),
                me.getRatingsField()
            ]);

            me.setFooter([me.getSaveBtn(), me.getSubmitBtn()]);

            me.dueDateCt = me.getComponent('dueDateCt');
            me.expirationDateCt = me.getComponent('expirationDateCt');
        }
    };
});