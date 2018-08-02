Ext.define('SlateTasksManager.controller.Tasks', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API',
        'Ext.window.Toast'
    ],

    views: [
        'TaskEditor',
        'TasksManager',
        'TaskDetails'
    ],

    stores: [
        'Tasks@Slate.cbl.store',
        'ParentTasks',
        'Skills@Slate.cbl.store'
    ],

    models: [
        'Task@Slate.cbl.model'
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
            taskEditorForm: 'slatetasksmanager-task-editor slate-modalform',
            skillsField: 'slate-skillsfield',
            attachmentsField: 'slate-tasks-attachmentsfield',
            taskStatusField: 'slatetasksmanager-task-editor #status'
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
        'slatetasksmanager-task-editor button[action=save]': {
            click: 'onSaveTaskClick'
        },
        // TODO: clonable was deleted from the form, due this another way
        'slatetasksmanager-task-editor slate-tasks-titlefield[clonable]': {
            select: 'onClonableTitleFieldSelect'
        },
        tasksManager: {
            rowdblclick: 'onEditTaskClick',
            select: 'onTaskManagerRecordSelect'
        }
    },

    onLaunch: function () {
        this.getTasksManager().render('slateapp-viewport');
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

    onClonableTitleFieldSelect: function(combo) {
        var me = this,
            record = combo.getSelectedRecord(),
            title = 'New Task',
            message = 'Do you want to clone this task?<br><strong>' + record.get('Title') + '</strong>';

        Ext.Msg.confirm(title, message, function(btnId) {
            if (btnId === 'yes') {
                me.cloneTask(record);
            }
        });
    },

    onTaskManagerRecordSelect: function() {
        this.showTaskDetails();
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
            form = me.getTaskEditorForm(),
            skillsField = me.getSkillsField(),
            attachmentsField = me.getAttachmentsField(),
            statusField = me.getTaskStatusField(),
            record = form.getRecord(),
            gridSelection = me.getTasksManager().getSelection()[0],
            errors;

        form.updateRecord(record);

        record.set({
            Status: statusField.getSubmitValue(),
            Skills: skillsField.getSkills(false), // returnRecords
            Attachments: attachmentsField.getAttachments(false) // returnRecords
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

        record.save({
            success: function(rec) {
                me.getTaskEditor().close();
                me.getTasksStore().reload({
                    callback: function() {
                        // update task details window if record is updated.
                        if (gridSelection && gridSelection.getId() === rec.getId()) {
                            me.getTaskDetails().updateTask(rec);
                        }
                    }
                });
                Ext.toast('Task succesfully saved!');
            }
        });
    },

    editTask: function(taskRecord) {
        var me = this,
            taskEditor = me.getTaskEditor();

        if (!taskRecord) {
            taskRecord = me.getTaskModel().create();
        }

        taskEditor.setTask(taskRecord);
        taskEditor.show();
    },

    deleteTask: function(taskRecord) {
        var store = this.getTasksStore();

        store.remove(taskRecord);
        store.sync();
    },

    cloneTask: function(taskRecord) {
        var me = this,
            taskCopy = taskRecord.copy(null);

        taskCopy.set({
            Title: taskCopy.get('Title') + ' Clone'
        });

        me.editTask(taskCopy);
    }
});