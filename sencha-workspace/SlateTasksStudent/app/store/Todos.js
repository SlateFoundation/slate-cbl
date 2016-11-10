/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.store.Todos', {
    extend: 'Ext.data.Store',

    model: 'SlateTasksStudent.model.StudentTodo',

    config: {
        pageSize: 0
    }
});
