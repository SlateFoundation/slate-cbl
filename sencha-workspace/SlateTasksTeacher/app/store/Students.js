Ext.define('SlateTasksTeacher.store.Students',{
    extend: 'Slate.cbl.store.Students',
    requires: [
        'Slate.proxy.Records'
    ],

    config: {
        courseSection: null
    },

    proxy: {
        type: 'slate-records'
    },

    sorters: [{
        property: 'LastName',
        direction: 'ASC'
    }],

    updateCourseSection: function(courseSection) {
        var me = this;

        me.getProxy().setUrl('/sections/'+courseSection+'/students');

        return me;
    }
});