Ext.define('Slate.cbl.store.RecentProgress', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.Records'
    ],


    config: {
        student: null,
        contentArea: null,

        remoteFilter: true,
        remoteSort: true,

        fields: [
            {
                name: 'demonstratedLevel',
                type: 'int'
            },
            {
                name: 'demonstrationCreated',
                type: 'date',
                dateFormat: 'timestamp'
            },
            {
                name: 'teacherTitle',
                type: 'string'
            },
            {
                name: 'competencyDescriptor',
                type: 'string'
            },
            {
                name: 'skillDescriptor',
                type: 'string'
            }
        ],

        proxy: {
            type: 'slate-records',
            url: '/cbl/dashboards/demonstrations/student/recent-progress'
        }
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