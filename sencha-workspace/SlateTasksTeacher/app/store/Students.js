Ext.define('SlateTasksTeacher.store.Students',{
    extend: 'Slate.cbl.store.Students',
    requires: [
        'Emergence.ext.proxy.Records'
    ],
    proxy: {
        type: 'slate-records'
    },

    config: {
        courseSection: null
    },

    updateCourseSection: function(courseSection) {
        var me = this;

        me.getProxy().setUrl('/sections/'+courseSection+'/students');

        return me;
    }
});