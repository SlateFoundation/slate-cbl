/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.store.StudentTasks', {
    extend: 'Ext.data.TreeStore',

    model: 'SlateTasksStudent.model.StudentTask',

    parentIdProperty: 'ParentID',

    config: {
        pageSize: 0
    }
});
