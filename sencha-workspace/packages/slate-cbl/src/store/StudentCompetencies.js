Ext.define('Slate.cbl.store.StudentCompetencies', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-studentcompetencies',


    model: 'Slate.cbl.model.StudentCompetency',
    config: {
        student: null,
        students: null,
        contentArea: null,

        remoteFilter: false,
        remoteSort: false
    },


    constructor: function() {
        this.callParent(arguments);
        this.dirty = true;
    },


    // config handlers
    updateStudent: function(student) {
        if (student) {
            this.setStudents(null);
        }

        this.getProxy().setExtraParam('student', student || null);
        this.dirty = true;
    },

    updateStudents: function(students) {
        if (students) {
            this.setStudent(null);
        }

        this.getProxy().setExtraParam('students', students || null);
        this.dirty = true;
    },

    updateContentArea: function(contentArea) {
        this.getProxy().setExtraParam('content_area', contentArea || null);
        this.dirty = true;
    },


    // member methods
    loadIfDirty: function() {
        if (!this.dirty) {
            return;
        }

        this.dirty = false;
        this.load();
    },

    unload: function() {
        this.loadCount = 0;
        this.removeAll();
    }
});