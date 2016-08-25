Ext.define('SlateTasksStudent.store.Todos', {
    extend: 'Ext.data.Store',

    model: 'SlateTasksStudent.model.StudentTodo',

    config: {
        pageSize: 0
    }
});
