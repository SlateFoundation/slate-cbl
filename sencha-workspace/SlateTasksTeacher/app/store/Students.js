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

    updateCourseSection: function(courseSection) {
        var me = this;

        me.getProxy().setUrl('/sections/'+courseSection+'/students');

        return me;
    }
});