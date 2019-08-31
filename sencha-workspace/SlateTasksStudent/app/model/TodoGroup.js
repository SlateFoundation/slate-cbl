Ext.define('SlateTasksStudent.model.TodoGroup', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.TodoGroups',

        /* global SlateTasksStudent */
        'SlateTasksStudent.model.Todo'
    ],


    // model config
    fields: [
        {
            name: 'studentId',
            type: 'int'
        },
        {
            name: 'section',
            allowNull: true
        },
        {
            name: 'sectionId',
            type: 'int',
            mapping: 'section.ID',
            defaultValue: null
        },
        {
            name: 'title',
            type: 'string'
        },
        {
            name: 'todos',
            convert: function(v) {
                var todos;

                if (v && v.isCollection) {
                    return v;
                }

                todos = new Ext.util.Collection({
                    decoder: todo => (todo.isModel ? todo : new SlateTasksStudent.model.Todo(todo)), // eslint-disable-line no-extra-parens
                    keyFn: todo => todo.getId()
                });

                if (v) {
                    todos.add(v);
                }

                return todos;
            }
        }
    ],

    proxy: 'slate-cbl-todogroups'
});