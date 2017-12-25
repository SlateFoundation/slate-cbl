Ext.define('Slate.cbl.store.StudentCompetencies', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.proxy.StudentCompetencies'
    ],


    model: 'Slate.cbl.model.StudentCompetency',
    config: {
        student: null,
        contentArea: null,

        remoteFilter: false,
        remoteSort: false,
        proxy: 'slate-cbl-studentcompetencies'
    },


    constructor: function() {
        this.callParent(arguments);
        this.dirty = true;
    },


    // config handlers
    updateStudent: function(student) {
        this.getProxy().setExtraParam('student', student || null);
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