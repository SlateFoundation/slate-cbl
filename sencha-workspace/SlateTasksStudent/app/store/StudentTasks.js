/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.store.StudentTasks', {
    extend: 'Ext.data.Store',

    model: 'SlateTasksStudent.model.StudentTask',

    config: {
        pageSize: 0
    }
});
