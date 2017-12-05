Ext.define('Slate.cbl.store.Tasks', {
    extend: 'Ext.data.Store',


    model: 'Slate.cbl.model.Task',
    config: {
        section: null,

        remoteFilter: true,
        remoteSort: true,
        pageSize: 0,

        // redeclare identical proxy as model for dynamic reconfiguration
        proxy: {
            type: 'slate-cbl-tasks'
        }
    },


    // config handlers
    updateSection: function(courseSection) {
        var me = this;

        me.getProxy().setExtraParam('course_section', courseSection);

        return me;
    }
});