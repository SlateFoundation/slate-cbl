Ext.define('SlateTasksManager.view.TaskEditor', {
    extend: 'Slate.cbl.view.tasks.TaskForm',
    xtype: 'slatetasksmanager-task-editor',

    config: {
        task: null,
        floating: true,
        closable: true,
        sectionField: {
            $value: false
        },

        parentTaskField: {
            $value: {
                store: 'ParentTasks'
            }
        },

        clonedTaskDisplayField: {
            $value: false
        }
    },

    enableAssignments: false,

    updateTask: function(task, oldTask) {
        var me = this,
            skillsField = me.getSkillsSelectorField(),
            attachmentsField = me.getAttachmentsField(),
            parentTaskField = me.getParentTaskField(),
            footer = me.getFooter(),
            statusField = footer.down('checkboxfield[name=Status]');

        me.reset();
        statusField.setValue(task.get('Status') ? task.get('Status') : 'shared');
        me.loadRecord(task);
        skillsField.setValue(task.get('Skills'));
        attachmentsField.setValue(task.get('Attachments'));


        me.setTitle((task.phantom ? 'Create' : 'Edit') + ' Task');
        footer.down('button[action=submit]').setText(task.phantom ? 'Create' : 'Save');
        // clear previous filters
        parentTaskField
            .getStore()
            .clearFilter();
        // filter out subtasks and current task
        parentTaskField
            .getStore()
            .filterBy(rec => rec.get('ParentTaskID') === null && rec.getId() !== task.getId());

        if (task.get('ParentTaskID')) {
            parentTaskField = me.getParentTaskField();
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