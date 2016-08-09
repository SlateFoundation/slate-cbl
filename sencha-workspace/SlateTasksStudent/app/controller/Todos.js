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
            enterkeypress: 'onTodosListEnterKeyPress'
//            datetriggerclick: 'onTodosListDateTriggerClick'
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
        var me = this;

        me.getTodoList().update(me.formatTodoLists(store.getRange()));
        me.addDateFields();
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
        var me = this,
            textfield = Ext.dom.Query.select('input#todo-item-new-text-'+parentId)[0],
            datefield = Ext.ComponentQuery.query('#datefield-'+parentId)[0],
            studentId = me.getTodosStore().getById(parentId).get('PersonID'),
            sectionId = me.getTodosStore().getById(parentId).get('Section').ID,
            rec;

        if (textfield.value && datefield.getValue()) {
            rec = Ext.create('SlateTasksStudent.model.Todo', {
                SectionID: sectionId,
                StudentID: studentId,
                Description: textfield.value,
                DueDate: datefield.getValue()
            });
            rec.save({
                success: function() {
                    me.getTodosStore().load();
                },
                failure: function() {
                    Ext.toast('Todo could not be created.');
                }
            });
        }
    },

/*
    onTodosListDateTriggerClick: function(cmp, el, parentId) {
        var datefield = Ext.create('Ext.form.field.Date',{});

        datefield.render(el);
    },
*/

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

    addDateFields: function() {

        var els = Ext.dom.Query.select('i.slate-todolist-date-trigger');
        Ext.each(els, function(el) {
            Ext.create('Ext.form.field.Date',{itemId: 'datefield-'+el.getAttribute('parentId')}).render(el);
        });

    }

});
