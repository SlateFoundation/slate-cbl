Ext.define('SlateTasksStudent.store.Todos', {
    extend: 'Ext.data.Store',


    model: 'SlateTasksStudent.model.TodosGroup',

    config: {
        student: null,
        section: null,

        pageSize: 0,
        remoteSort: false,

        // redeclare identical proxy as model for dynamic reconfiguration
        proxy: {
            type: 'slate-cbl-todos'
        }
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

        this.dirty = false;
        this.load();
    }
});