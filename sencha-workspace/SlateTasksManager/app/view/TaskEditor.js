Ext.define('SlateTasksManager.view.TaskEditor', {
    extend: 'Slate.cbl.view.tasks.TaskForm',
    xtype: 'slatetasksmanager-task-editor',

    config: {
        task: null,
        floating: true,
        closable: true
    },

    enableAssignments: false,

    updateTask: function(task, oldTask) {
        var me = this,
            skillsField = me.getSkillsSelectorField(),
            attachmentsField = me.getAttachmentsField(),
            footer = me.getFooter(),
            statusField = footer.down('checkboxfield[name=Status]');

        me.reset();
        statusField.setValue(task.get('Status') ? task.get('Status') : 'shared');
        me.loadRecord(task);
        skillsField.setValue(task.get('Skills'));
        attachmentsField.setValue(task.get('Attachments'));


        me.setTitle((task.phantom ? 'Create' : 'Edit') + ' Task');
        footer.down('button[action=submit]').setText(task.phantom ? 'Create' : 'Save');

        if (task.get('ParentTaskID')) {
            parentTaskField = form.down('slate-tasks-titlefield[name=ParentTaskID]');
            parentTaskStore = parentTaskField.getStore();
            //load parent task if store does not contain the record
            if (!parentTaskStore.getById(task.get('ParentTaskID'))) {
                parentTaskStore.load({
                    url: Slate.API.buildUrl('/cbl/tasks/'+task.get('ParentTaskID')),
                    params: {
                        summary: true
                    },
                    addRecords: true,
                    callback: function (records) {
                        parentTaskField.setValue(task.get('ParentTaskID'));
                    }
                });
            }
        }
    }
});