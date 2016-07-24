Ext.define('SlateTasksTeacher.view.TaskEditor', {
    extend: 'Slate.cbl.view.modals.CreateTask',
    xtype: 'slate-tasks-teacher-taskeditor',

    config: {
        studentTask: null
    },

    updateStudentTask: function(studentTask, oldStudentTask) {
        //TODO: override task data with student data
        var me = this,
            assignmentsfield = me.down('slate-tasks-assignmentsfield'),
            assignmentsfieldCheckbox = assignmentsfield.down('checkboxfield'),
            titleField = me.down('slate-tasks-titlefield'),
            parentTaskField = titleField.next('slate-tasks-titlefield'),
            experienceField = me.down('#experience-type'),
            duedateField = me.down('#due-date'),
            expirationdateField = me.down('#expiration-date'),
            skillsField = me.down('slate-skillsfield'),
            attachmentsfield = me.down('slate-tasks-attachmentsfield'),
            instructionsField = me.down('#instructions'),
            taskPrivacyField = me.down('#status');

        //move to controller?

        if (assignmentsfieldCheckbox) {
            assignmentsfieldCheckbox.destroy();
        }

        me.insert(0, assignmentsfield);

        //hide & disable fields
        assignmentsfield.down('combo').setReadOnly(true);
        titleField.setReadOnly(true);
        parentTaskField.setReadOnly(true);
        experienceField.setReadOnly(true);
        instructionsField.setReadOnly(true);
        skillsField.setReadOnly(true);
        attachmentsfield.setReadOnly(true);

        taskPrivacyField.setDisabled(true);

        assignmentsfield.down('combo').setValue(studentTask.StudentID);

        //override fields
        if (studentTask.DueDate) {
            duedateField.setValue(Ext.Date.format(new Date(studentTask.DueDate * 1000), 'm/d/Y'));
        }

        if (studentTask.ExpirationDate) {
            expirationdateField.setValue(Ext.Date.format(new Date(studentTask.ExpirationDate * 1000), 'm/d/Y'));
        }
    },

    updateTask: function(task, oldTask) {
        var me = this,
            form = me.down('slate-modalform'),
            skillsField = form.down('slate-skillsfield'),
            attachmentsField = form.down('slate-tasks-attachmentsfield'),
            taskPrivacyField = me.down('#status'), taskStatus;

        form.reset();
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

        switch (task.get('Status')) {
            case 'shared':
                taskStatus = 'shared';
                break;
            case 'private':
                taskStatus = false;
                break;
        }

        taskPrivacyField.setValue(taskStatus);
    }
});