Ext.define('SlateTasksManager.controller.Tasks', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],

    views: [
        'TaskEditor',
        'TasksManager'
    ],

    stores: [
        'Tasks@Slate.cbl.store',
        'ParentTasks@Slate.cbl.store',
        'Skills@Slate.cbl.store'
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
        'slatetasksmanager-task-editor slate-tasks-titlefield[clonable]' : {
            select: 'onClonableTitleFieldSelect'
        },
        tasksManager: {
            rowdblclick: 'onEditTaskClick'
        }
    },

    onLaunch: function () {
        this.getTasksManager().render('slate-tasks-manager');
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

        if (selection) {
            title = 'Delete Task';
            message = 'Are you sure you want to delete this task?' + '<br><strong>' + selection.get('Title') + '</strong>';
            return Ext.Msg.confirm(title, message, function(response){
                if (response === 'yes') {
                    return me.deleteTask(selection);
                }
            });
        } else {
            return Ext.Msg.alert('Delete Task', 'Nothing selected. Please select a task to delete.');
        }
    },

    onSaveTaskClick: function() {
        return this.saveTask();
    },

    onClonableTitleFieldSelect: function(combo) {
        var me = this,
            record = combo.getSelectedRecord(),
            title = "New Task",
            message = "Do you want to clone this task?" + '<br><strong>' + record.get('Title') + '</strong>';

        Ext.Msg.confirm(title, message, function(btnId) {
            if (btnId === 'yes') {
                me.cloneTask(record);
            }
        });
    },

    saveTask: function() {
        var me = this,
            form = me.getTaskEditorForm(),
            skillsField = me.getSkillsField(),
            attachmentsField = me.getAttachmentsField(),
            statusField = me.getTaskStatusField(),
            record = form.getRecord(),
            wasPhantom = record.phantom,
            errors;

        form.updateRecord(record);

        record.set('Status', statusField.getSubmitValue());
        //set skills
        record.set('Skills', skillsField.getSkills(false)); // returnRecords
        record.set('Attachments', attachmentsField.getAttachments(false)); // returnRecords

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
                if (wasPhantom) {
                    me.getTasksStore().loadRecords([rec], {addRecords: true});
                }
                Ext.toast('Task succesfully saved!');
            }
        });
    },

    editTask: function(taskRecord) {
        var me = this,
            taskEditor = me.getTaskEditor(),
            form = me.getTaskEditorForm();

        if (!taskRecord) {
            taskRecord = Ext.create('Slate.cbl.model.Task');
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
            taskEditor = me.getTaskEditor(),
            taskCopy = taskRecord.copy(null);

        taskCopy.set('Title', taskCopy.get('Title') + ' Clone');
        //reset handle to prevent validation error
        taskCopy.set('Handle', null);
        me.editTask(taskCopy);
    }
});