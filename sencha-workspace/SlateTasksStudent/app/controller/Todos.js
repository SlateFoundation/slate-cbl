/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.controller.Todos', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.form.field.Date',
        'Ext.window.Toast'
    ],


    // entry points
    control: {
        'slatetasksstudent-todolist': {
            render: 'onTodosListRender',
            checkclick: 'onTodosListCheckClick',
            enterkeypress: 'onTodosListEnterKeyPress',
            datechange: 'onTodosListDateChange'
        }
    },

    listen: {
        store: {
            '#Todos': {
                load: 'onTodosStoreLoad'
            }
        }
    },


    // controller configuration
    views: [
        'TodoList'
    ],

    stores: [
        'Todos'
    ],

    refs: {
        todoList: {
            selector: 'slatetasksstudent-todolist',
            autoCreate: true,

            xtype: 'slatetasksstudent-todolist'
        }
    },


    // event handlers
    onTodosListRender: function() {
        this.getTodosStore().load();
    },

    onTodosStoreLoad: function(store) {
        var me = this,
            todoList = me.getTodoList();

        todoList.update(me.formatTodoLists(store.getRange()));
        todoList.restoreVisibilityState();
    },

    onTodosListCheckClick: function(cmp, parentId, recordId, checked) {
        var me = this,
            rec = me.getTodosStore().getById(parentId).Todos().getById(recordId);

        rec.set('Completed',checked);
        rec.save({
            success: function() {
                me.getTodosStore().load();
            },
            failure: function() {
                Ext.toast('Todo could not be updated.');
            }
        });
    },

    onTodosListEnterKeyPress: function(cmp, parentId) {
        this.insertNewTodo(parentId);
    },

    onTodosListDateChange: function(cmp, parentId) {
        this.insertNewTodo(parentId);
    },


    // custom controller methods
    formatTodoLists: function(recs) {
        var me = this,
            recsLength = recs.length,
            todoSections = [],
            i = 0,
            rec,
            section,
            todos;


        for (;i<recsLength; i++) {
            rec = recs[i];
            section = rec.get('Section');

            todos = me.formatTodos(rec.Todos().getRange());

            Ext.apply(todos, {
                section: section.Title,
                ID: rec.get('ID')
            });

            todoSections.push(todos);
        }

        return todoSections;
    },

    formatTodos: function(recs) {
        var recsLength = recs.length,
            i = 0,
            todos = [],
            completeTodos = [],
            activeTodos = [],
            rec;

        for (;i<recsLength; i++) {
            rec = recs[i];

            if (rec.get('Completed')) {
                completeTodos.push(rec.getData());
            } else {
                activeTodos.push(rec.getData());
            }
        }

        todos.push({
            Title: 'Active Items',
            canAdd: true,
            items: activeTodos
        });

        if (completeTodos.length > 0) {
            todos.push({
                Title: 'Completed Items',
                items: completeTodos
            });
        }

        return {todos: todos};
    },

    insertNewTodo: function(parentId) {
        var textfield = Ext.dom.Query.select('input#todo-item-new-text-'+parentId)[0],
            datefield = Ext.dom.Query.select('input#todo-item-new-date-'+parentId)[0],
            dueDate = new Date(datefield.value.replace(/-/g, '\/')).getTime() / 1000,
            store = this.getTodosStore(),
            parentRec = store.getById(parentId),
            rec;

        if (textfield.value && datefield.value) {
            rec = Ext.create('SlateTasksStudent.model.Todo', {
                SectionID: parentRec.get('Section').ID,
                StudentID: parentRec.get('PersonID'),
                Description: textfield.value,
                DueDate: dueDate
            });
            rec.save({
                success: function() {
                    store.load();
                },
                failure: function() {
                    Ext.toast('Todo could not be created.');
                }
            });
        }
    }

});
