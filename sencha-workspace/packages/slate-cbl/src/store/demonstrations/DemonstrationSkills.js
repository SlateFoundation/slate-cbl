Ext.define('Slate.cbl.store.demonstrations.DemonstrationSkills', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-demonstrationskills',


    model: 'Slate.cbl.model.demonstrations.DemonstrationSkill',
    config: {
        student: null,
        skill: null,

        remoteFilter: false,
        remoteSort: false
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

    updateSkill: function(skill) {
        this.getProxy().setExtraParam('skill', skill || null);
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