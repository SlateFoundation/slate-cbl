Ext.define('SlateTasksTeacher.view.TaskRater', {
    extend: 'Slate.cbl.view.modals.RateTask',

    xtype: 'slate-tasks-teacher-taskrater',

    updateTask: function(task, oldTask) {
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

    updateStudentTask: function(studentTask, oldStudentTask) {
        var me = this,
            form = me.down('slate-modalform'),
            ratingsView = me.down('slate-ratingview'),
            skillRatingIds = [],
            task = me.getTask(),
            groupedSkills = task.getSkillsGroupedByCompetency();


        form.down('[name=StudentFullName]').setValue(studentTask.Student.FirstName + ' ' + studentTask.Student.LastName);
        form.down('[name=DueDate]').setValue(studentTask.DueDate);
        form.down('[name=Submitted]').setValue(studentTask.Submitted);

        for(var i = 0; i < studentTask.SkillRatings.length; i++) {
            skillRatingIds.push(studentTask.SkillRatings[i].SkillID);
        }
        //set skill ratings
        Ext.each(groupedSkills, function(competency) {
            Ext.each(competency.skills, function(skill) {
                if (skillRatingIds.indexOf(skill.ID) > -1) {
                    skill.rating = studentTask.SkillRatings[skillRatingIds.indexOf(skill.ID)].Score;
                    skill.level = 11;
                }
            });
        });
        ratingsView.setData({
            ratings: [7, 8, 9, 10, 11, 12, 'M'],
            competencies: groupedSkills
        });
    }
});