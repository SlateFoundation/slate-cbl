Ext.define('SlateTasksStudent.store.SectionParticipants', {
    extend: 'Slate.store.courses.SectionParticipants',


    config: {
        role: 'Student',
        student: null,

        proxy: {
            type: 'slate-courses-participants',
            include: [
                'Section.Term'
            ]
        }
    },

    // config handlers
    updateStudent: function(student) {
        this.getProxy().setExtraParam('student', student);
        this.dirty = true;
    }

});
