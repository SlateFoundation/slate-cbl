Ext.define('SlateTasksManager.controller.Tasks', {
    extend: 'Ext.app.Controller',
    requires: [
        // 'Slate.API',
        // 'Ext.window.Toast'
    ],

    views: [
        'TasksManager',
        'TaskEditor'
        // 'TaskDetails'
    ],

    stores: [
        'Tasks',
        'ParentTasks'
    ],

    models: [
        'Task@Slate.cbl.model.tasks'
    ],

    config: {
        refs: {
            tasksManager: {
                selector: 'slate-tasks-manager',
                autoCreate: true,

                xtype: 'slate-tasks-manager'
            },

            taskEditor: {
                selector: 'slatetasksmanager-task-editor',
                autoCreate: true,

                xtype: 'slatetasksmanager-task-editor'
            },
            taskDetails: 'slate-tasks-manager-details',
            clonedTaskField: 'slate-cbl-tasks-taskform field[name=ClonedTaskID]'
            // taskEditorForm: 'slatetasksmanager-task-editor slate-modalform',
            // skillsField: 'slate-skillsfield',
            // attachmentsField: 'slate-tasks-attachmentsfield',
            // taskStatusField: 'slatetasksmanager-task-editor #status'
        }
    },

    control: {
        'slate-tasks-manager toolbar button[action=delete]': {
            click: 'onDeleteTaskClick'
        },
        'slate-tasks-manager toolbar button[action=edit]': {
            click: 'onEditTaskClick'
        },
        'slate-tasks-manager toolbar button[action=create]': {
            click: 'onCreateTaskClick'
        },
        'slatetasksmanager-task-editor button[action=submit]': {
            click: 'onSaveTaskClick'
        },
        clonedTaskField: {
            beforeselect: 'onBeforeClonedTaskSelect',
            select: 'onClonedTaskSelect'
        },
        tasksManager: {
            rowdblclick: 'onEditTaskClick',
            select: 'onTaskManagerRecordSelect'
        }
    },

    onLaunch: function () {
        this.getTasksManager().render('slateapp-viewport');
        this.getTasksStore().load();
    },

    onCreateTaskClick: function() {
        return this.editTask();
    },

    onEditTaskClick: function() {
        var me = this,
            selection = me.getTasksManager().getSelection()[0];

        if (!selection) {
            return Ext.Msg.alert('Edit Task', 'Nothing selected. Please select a task to edit.');
        }
        return me.editTask(selection);
    },

    onDeleteTaskClick: function() {
        var me = this,
            taskManager = me.getTasksManager(),
            selection = taskManager.getSelection()[0],
            title, message;

        if (!selection) {
            Ext.Msg.alert('Delete Task', 'Nothing selected. Please select a task to delete.');
            return;
        }

        title = 'Delete Task';
        message = 'Are you sure you want to delete this task? <br><strong>' + selection.get('Title') + '</strong>';
        Ext.Msg.confirm(title, message, function(response) {
            if (response === 'yes') {
                me.deleteTask(selection);
            }
        });
    },

    onSaveTaskClick: function() {
        return this.saveTask();
    },

    onTaskManagerRecordSelect: function() {
        this.showTaskDetails();
    },

    onBeforeClonedTaskSelect: function(clonedTaskField, clonedTask) {
        var formPanel = this.getTaskEditor();

        if (!formPanel.getTask().phantom) {
            return true;
        }

        if (
            clonedTaskField.confirmedOverwrite === clonedTask
            || !formPanel.isDirty()
        ) {
            delete clonedTaskField.confirmedOverwrite;
            return true;
        }

        Ext.Msg.confirm(
            'Are you sure?',
            'Selecting a task to clone may overwrite what you have input already, proceed?',
            function(btnId) {
                if (btnId == 'yes') {
                    clonedTaskField.confirmedOverwrite = clonedTask;
                    clonedTaskField.setSelection(clonedTask);
                }
            }
        );

        return false;
    },

    onClonedTaskSelect: function(clonedTaskField, clonedTask) {
        var formPanel = this.getTaskEditor(),
            form = formPanel.getForm(),
            fields = clonedTask.getFields(),
            fieldsLength = fields.length, fieldIndex = 0, field, fieldName, formField;

        formPanel.setLoading('Cloning task&hellip;');

        clonedTask.load({
            success: function(loadedTask, operation) {
                for (; fieldIndex < fieldsLength; fieldIndex++) {
                    field = fields[fieldIndex];

                    if (!field.clonable) {
                        continue;
                    }

                    fieldName = field.name;
                    formField = form.findField(fieldName);

                    if (formField) {
                        formField.setValue(loadedTask.get(fieldName));
                    } else {
                        Ext.Logger.warn('Could not find form field for clonable task model field: '+fieldName);
                    }
                }

                formPanel.setLoading(false);
            },
            failure: function(savedTask, operation) {
                formPanel.setLoading(false);

                Ext.Msg.show({
                    title: 'Failed to save task',
                    message: Ext.util.Format.htmlEncode(operation.getError()),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },


    showTaskDetails: function(task) {
        var me = this,
            taskDetails = me.getTaskDetails(),
            taskManager = me.getTasksManager();

        if (!task && !(task = taskManager.getSelection()[0])) {
            return;
        }

        taskDetails.setTask(task);
    },

    saveTask: function() {
        var me = this,
            form = me.getTaskEditor(),
            skillsField = form.getSkillsSelectorField(),
            attachmentsField = form.getAttachmentsField(),
            statusField = form.getFooter().down('checkboxfield[name=Status]'),
            record = form.getRecord(),
            gridSelection = me.getTasksManager().getSelection()[0],
            errors;

        form.updateRecord(record);

        record.set({
            Status: statusField.getSubmitValue(),
            Skills: skillsField.getValue(),
            Attachments: attachmentsField.getValue()
        });

        errors = record.validate();

        if (errors.length) {
            Ext.each(errors.items, function(item) {
                var itemField = form.down('[name='+item.field +']');

                if (itemField) {
                    itemField.markInvalid(item.message);
                }
            });
            return;
        }

        form.setLoading('Saving task&hellip;');
        record.save({
            success: function(savedTask) {
                var tasksStore = me.getTasksStore();

                tasksStore.beginUpdate();
                tasksStore.mergeData([savedTask]);
                tasksStore.endUpdate();

                form.setLoading(false);
                form.hide();

                Ext.toast('Task succesfully saved!');
            },
            failure: function(savedTask, operation) {
                form.setLoading(false);
                Ext.Msg.show({
                    title: 'Failed to save task',
                    message: Ext.util.Format.htmlEncode(operation.getError()),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },

    editTask: function(taskRecord) {
        var me = this,
            taskEditor = me.getTaskEditor();

        taskEditor.setClonedTaskDisplayField({ hidden: !taskRecord });
        taskEditor.setClonedTaskField({ hidden: !!taskRecord });

        if (!taskRecord) {
            taskRecord = me.getTaskModel().create({
                SectionID: 0
            });
        }

        taskEditor.setTask(taskRecord);
        taskEditor.show();
    },

    deleteTask: function(taskRecord) {
        var store = this.getTasksStore();

        store.remove(taskRecord);
        store.sync();
    }
});