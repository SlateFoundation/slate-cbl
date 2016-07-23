Ext.define('SlateTasksManager.view.TaskEditor', {
    extend: 'Slate.cbl.view.modals.CreateTask',
    xtype: 'slatetasksmanager-task-editor',

    config: {
        task: null
    },

    enableAssignments: false,

    updateTask: function(task, oldTask) {
        var me = this,
            form = me.down('slate-modalform'),
            skillsField = form.down('slate-skillsfield'),
            attachmentsField = form.down('slate-tasks-attachmentsfield'),
            statusField = me.down('#status');

        form.reset();
        statusField.setValue(task.get('Status') ? task.get('Status') : 'shared');
        form.loadRecord(task);
        skillsField.setSkills(task.get('Skills'));
        attachmentsField.setAttachments(task.get('Attachments'));


        me.setTitle((task.phantom ? 'Create' : 'Edit') + ' Task');
        me.down('button[action=save]').setText(task.phantom ? 'Create' : 'Save');

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