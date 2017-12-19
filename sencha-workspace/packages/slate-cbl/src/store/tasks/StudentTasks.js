Ext.define('Slate.cbl.store.tasks.StudentTasks', {
    extend: 'Ext.data.Store',


    model: 'Slate.cbl.model.tasks.StudentTask',
    config: {
        section: null,

        remoteFilter: true,
        remoteSort: true,
        pageSize: 0,

        // redeclare identical proxy as model for dynamic reconfiguration
        proxy: 'slate-cbl-studenttasks',
    },


    constructor: function() {
        this.callParent(arguments);
        this.dirty = true;
    },


    // config handlers
    updateSection: function(section) {
        this.getProxy().setExtraParam('course_section', section || null);
        this.dirty = true;
    },


    // member methods
    loadIfDirty: function(clearBeforeLoad) {
        var me = this;

        if (!me.dirty) {
            return;
        }

        me.dirty = false;

        if (clearBeforeLoad) {
            me.unload();
        }

        me.load();
    },

    unload: function() {
        this.loadCount = 0;
        this.removeAll();
    }
});
