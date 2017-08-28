Ext.define('SlateTasksTeacher.view.TaskRater', {
    extend: 'Slate.cbl.view.modals.RateTask',

    xtype: 'slate-tasks-teacher-taskrater',
    config: {
        readOnly: null
    },

    updateTask: function(task) {
        var me = this,
            form = me.down('slate-modalform'),
            attachmentsField = me.down('slate-tasks-attachmentsfield'),
            skillsField = me.down('slate-skillsfield');

        form.down('[name=Title]').setValue(task.get('Title'));
        form.down('[name=ParentTaskTitle]').setValue(task.get('ParentTask') ? task.get('ParentTask').Title : '');
        form.down('[name=ExperienceType]').setValue(task.get('ExperienceType'));
        form.down('[name=ExpirationDate]').setValue(task.get('ExpirationDate'));

        attachmentsField.setAttachments(task.get('Attachments'));
        attachmentsField.setReadOnly(true);

        skillsField.setSkills(task.get('Skills'));
        skillsField.setReadOnly(true);
    },

    updateStudentTask: function(studentTask) {
        var me = this,
            form = me.down('slate-modalform'),
            ratingsView = me.down('slate-ratingview'),
            commentsField = form.down('slate-commentsfield'),
            submissionsCmp = form.down('slate-tasks-submissions'),
            skillsField = me.down('slate-skillsfield'),
            groupedSkills = studentTask.getTaskSkillsGroupedByCompetency();

        if (studentTask.get('DueDate')) {
            form.down('[name=DueDate]').setValue(studentTask.get('DueDate'));
        }

        form.down('[name=ExpirationDate]').setValue(studentTask.get('ExpirationDate'));

        form.down('[name=StudentFullName]').setValue(studentTask.get('Student').FirstName + ' ' + studentTask.get('Student').LastName);
        form.down('#student-attachments').setAttachments(studentTask.get('Attachments'));
        commentsField.setRecord(studentTask);
        submissionsCmp.setData(studentTask.get('Submissions'));
        skillsField.setSkills(studentTask.get('Skills'), true, false); // appendSkills, editable
        ratingsView.setData({
            ratings: [1, 2, 3, 'M'],
            competencies: groupedSkills
        });
    },

    updateReadOnly: function(readOnly) {
        var me = this,
            toolbarBtns = me.query('container[dock=bottom] button'),
            // attachmentsField = me.down('slate-tasks-attachmentsfield'),
            reassignField = me.down('slate-tasks-reassignfield'),
            commentField = me.down('textareafield'),
            ratingView = me.down('slate-ratingview'),
            i = 0;

        ratingView.setReadOnly(readOnly);
        commentField.setReadOnly(readOnly);
        reassignField[readOnly ? 'hide' : 'show']();
        // attachmentsField.setReadOnly(readOnly); // todo: implement studenttask specific attachments

        for (; i < toolbarBtns.length; i++) {
            toolbarBtns[i].setDisabled(readOnly);
        }
    }
});
