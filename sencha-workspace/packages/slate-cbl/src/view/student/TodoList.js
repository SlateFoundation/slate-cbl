Ext.define('Slate.cbl.view.student.TodoList', {
    extend: 'Ext.Panel',
    xtype: 'slate-todolist',
    requires:[
    ],

    config: {
    },

    componentCls: 'slate-todolist',

    title: 'To-Do List – Personal',

    data: {
        baz: 'qux'
    },

    tpl: [
        '{baz}'
    ]
});