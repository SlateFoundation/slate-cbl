/* global Slate*/
Ext.define('SlateTasksTeacher.view.TaskEditor', {
    extend: 'Slate.cbl.view.modals.CreateTask',
    xtype: 'slate-tasks-teacher-taskeditor',

    config: {
        task: null,
        studentTask: null
    },

    updateStudentTask: function(studentTask) {
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

        if (studentTask) {
            // move to controller?
            if (assignmentsfieldCheckbox) {
                assignmentsfieldCheckbox.destroy();
            }

            me.insert(0, assignmentsfield);

            // hide & disable fields
            assignmentsfield.down('combo').setReadOnly(true);
            titleField.setReadOnly(true);
            parentTaskField.setReadOnly(true);
            experienceField.setReadOnly(true);
            instructionsField.setReadOnly(true);
            skillsField.setReadOnly(true);
            attachmentsfield.setReadOnly(true);

            taskPrivacyField.setDisabled(true);

            assignmentsfield.down('combo').setValue(studentTask.get('StudentID'));

            // override fields
            if (studentTask.get('DueDate')) {
                duedateField.setValue(studentTask.get('DueDate'), 'm/d/Y');
            }

            if (studentTask.get('ExpirationDate')) {
                expirationdateField.setValue(studentTask.get('DueDate'), 'm/d/Y');
            }
        }
    },

    updateTask: function(task) {
        var me = this,
            form = me.down('slate-modalform'),
            skillsField = form.down('slate-skillsfield'),
            attachmentsField = form.down('slate-tasks-attachmentsfield'),
            taskPrivacyField = me.down('#status'), taskStatus,
            parentTaskField, parentTaskStore;

        form.reset();
        form.loadRecord(task);
        skillsField.setSkills(task.get('Skills'));
        attachmentsField.setAttachments(task.get('Attachments'));

        me.setTitle((task.phantom ? 'Create' : 'Edit') + ' Task');
        me.down('button[action=save]').setText(task.phantom ? 'Create' : 'Save');

        if (task.get('ParentTaskID')) {
            parentTaskField = form.down('slate-tasks-titlefield[name=ParentTaskID]');
            parentTaskStore = parentTaskField.getStore();
            // load parent task if store does not contain the record
            if (!parentTaskStore.getById(task.get('ParentTaskID'))) {
                parentTaskStore.load({
                    url: Slate.API.buildUrl('/cbl/tasks/'+task.get('ParentTaskID')),
                    params: {
                        summary: true
                    },
                    addRecords: true,
                    callback: function () {
                        parentTaskField.setValue(task.get('ParentTaskID'));
                    }
                });
            }
        }

        if (task.get('Status') === 'shared') {
            taskStatus = 'shared';
        } else if (task.get('Status') === 'private') {
            taskStatus = false;
        }

        taskPrivacyField.setValue(taskStatus);
    }
});