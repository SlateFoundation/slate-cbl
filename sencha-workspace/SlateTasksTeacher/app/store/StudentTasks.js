Ext.define('Slate.cbl.store.tasks.StudentTasks', {
    extend: 'Ext.data.Store',


    model: 'Slate.cbl.model.tasks.StudentTask',
    config: {
        section: null,

        remoteFilter: true,
        remoteSort: true,
        pageSize: 0,

        // redeclare identical proxy as model for dynamic reconfiguration
        proxy: {
            type: 'slate-cbl-studenttasks',
            include: [
                'Attachments.File',
                'Comments',
                'Skills',
                'Student',
                'TaskSkills',
                'Submissions'
            ]
        },
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
    loadIfDirty: function() {
        if (!this.dirty) {
            return;
        }

        this.dirty = false;
        this.load();
    }
});
