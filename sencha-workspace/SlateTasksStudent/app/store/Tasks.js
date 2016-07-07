/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.store.Tasks', {
    extend: 'Ext.data.Store',

    model: 'SlateTasksStudent.model.Task',

    config: {
        pageSize: 0
    }
});
