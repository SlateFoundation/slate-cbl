/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.store.StudentTasks', {
    extend: 'Ext.data.TreeStore',

    model: 'SlateTasksStudent.model.StudentTask',

    parentIdProperty: 'ParentID',
    remoteSort: true,

    config: {
        pageSize: 0
    },

    proxy: {
        type: 'slate-records',
        url: '/cbl/student-tasks/list'
    }

});
