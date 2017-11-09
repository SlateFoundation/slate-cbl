Ext.define('SlateTasksStudent.store.Todos', {
    extend: 'Ext.data.Store',


    model: 'SlateTasksStudent.model.StudentTodo',

    config: {
        student: null,
        section: null,

        pageSize: 0
    },


    // config handlers
    updateStudent: function(student) {
        this.getProxy().setExtraParam('student', student || null);
        this.dirty = true;
    },

    updateSection: function(section) {
        this.getProxy().setExtraParam('course_section', section || null);
        this.dirty = true;
    },


    // member methods
    loadIfDirty: function() {
        if (!this.dirty || this.getStudent() === null || this.getSection() === null) {
            return;
        }

        this.load();
    }
});