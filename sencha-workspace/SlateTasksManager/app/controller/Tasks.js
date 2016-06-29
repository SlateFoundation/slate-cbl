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

            taskEditorForm: 'slatetasksmanager-task-editor slate-modalform'
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
            return Ext.Msg.alert('Error', 'Please select a task first.');
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
            message = 'Are you sure you want to delete this task (' + selection.get('Title') + ')?';
            return Ext.Msg.confirm(title, message, function(response){
                if (response === 'yes') {
                    return me.deleteTask(selection);
                }
            });
        }
    },

    editTask: function(taskRecord) {
        var me = this,
            taskEditor = me.getTaskEditor(),
            form = me.getTaskEditorForm();

        form.reset();

        if (taskRecord) {
            form.loadRecord(taskRecord);
        }

        taskEditor.show();
    },

    deleteTask: function(taskRecord) {
        var store = this.getTasksStore();

        store.remove(taskRecord);
        store.sync();
    }
});