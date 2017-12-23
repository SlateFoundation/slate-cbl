Ext.define('SlateTasksStudent.model.TodosGroup', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
        'SlateTasksStudent.model.Todo'
    ],


    // model config
    idProperty: 'ID',

    fields: [
        {
            name: 'ID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'SectionID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'StudentID',
            type: 'int'
        },
        {
            name: 'Title',
            type: 'string'
        },
        {
            name: 'Todos'
        }
    ],

    hasMany: [{
        model: 'SlateTasksStudent.model.Todo',
        name: 'Todos',
        associationKey: 'Todos'
    }],

    proxy: {
        type: 'slate-records',
        url: '/cbl/todos'
    }
});