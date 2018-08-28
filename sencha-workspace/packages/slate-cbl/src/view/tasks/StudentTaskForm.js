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

            dueDateField: {
                merge: mergeFn,
                $value: {
                    name: 'DueDate',

                    xtype: 'datefield',
                    hidden: true
                }
            },
            dueDateDisplayField: {
                merge: mergeFn,
                $value: {
                    name: 'EffectiveDueDate',

                    xtype: 'displayfield',
                    hidden: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
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
                    hidden: true
                }
            },
            expirationDateDisplayField: {
                merge: mergeFn,
                $value: {
                    name: 'EffectiveExpirationDate',

                    xtype: 'displayfield',
                    hidden: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
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
            attachmentsField: {
                merge: mergeFn,
                $value: {
                    name: 'Attachments',

                    xtype: 'slate-cbl-attachments-field',
                    readOnly: true
                }
            },

            hidden: true,
            title: null,
            createTitle: 'Assign to {0} {1}: {2}',
            editTitle: 'Rate for {0} {1}: {2}',

            footer: [
                {
                    xtype: 'button',
                    text: 'Save Assignment',
                    scale: 'large',
                    action: 'submit',
                    margin: '0 0 0 16'
                }
            ]
        },


        componentCls: 'slate-cbl-tasks-studenttaskform',


        // config handlers
        updateStudentTask: function(studentTask, oldStudentTask) {
            var me = this,
                dueDateField = me.getDueDateField(),
                dueDateOverrideField = me.getDueDateOverrideField(),
                dueDateReadOnly = dueDateField.readOnly,
                expirationDateField = me.getExpirationDateField(),
                expirationDateOverrideField = me.getExpirationDateOverrideField(),
                expirationDateReadOnly = expirationDateField.readOnly,
                studentData, dueDate, expirationDate;

            Ext.suspendLayouts();

            if (studentTask) {
                studentData = studentTask.get('Student');
                dueDate = studentTask.get('DueDate');
                expirationDate = studentTask.get('ExpirationDate');

                me.setTitle(Ext.String.format(
                    studentTask.phantom ? me.getInitialConfig('createTitle') : me.getInitialConfig('editTitle'),
                    studentData.FirstName,
                    studentData.LastName,
                    studentTask.get('Task').Title
                ));

                me.getRatingsField().setSelectedStudent(studentTask.get('Student').Username);

                me.getDueDateDisplayField().setHidden(dueDate && !dueDateReadOnly);
                dueDateField.setHidden(!dueDate || dueDateReadOnly);
                dueDateOverrideField.setHidden(dueDateReadOnly);
                dueDateOverrideField.setValue(dueDateReadOnly ? null : Boolean(dueDate));

                me.getExpirationDateDisplayField().setHidden(expirationDate && !expirationDateReadOnly);
                expirationDateField.setHidden(!expirationDate || expirationDateReadOnly);
                expirationDateOverrideField.setHidden(expirationDateReadOnly);
                expirationDateOverrideField.setValue(expirationDateReadOnly ? null : Boolean(expirationDate));

                me.getParentTaskField().setHidden(!studentTask.get('ParentTask'));


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

        applyRatingsField: applyFn,
        applyAttachmentsField: applyFn,


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
                me.getRatingsField(),
                me.getAttachmentsField()
            ]);
        }
    };
});