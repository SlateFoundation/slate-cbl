Ext.define('SlateTasksStudent.store.TodoGroups', {
    extend: 'Ext.data.Store',


    model: 'SlateTasksStudent.model.TodoGroup',

    config: {
        student: null,
        section: null,

        pageSize: 0,
        remoteSort: false,

        // redeclare identical proxy as model for dynamic reconfiguration
        proxy: 'slate-cbl-todogroups'
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