/**
 * The Todos controller manages the student todo list
 */
Ext.define('SlateTasksStudent.controller.Todos', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.form.field.Date',
        'Ext.window.Toast',
        'Slate.API'
    ],


    // dependencies
    views: [
        'TodoList'
    ],

    models: [
        'Todo'
    ],

    stores: [
        'Todos'
    ],


    // component references
    refs: {
        todoList: {
            selector: 'slatetasksstudent-todolist',
            autoCreate: true,

            xtype: 'slatetasksstudent-todolist'
        }
    },


    // entry points
    control: {
        'slatetasksstudent-todolist': {
            boxready: 'onTodosListBoxReady',
            checkclick: 'onTodosListCheckClick',
            clearcompleted: 'onTodosListClearCompletedClick',
            enterkeypress: 'onTodosListEnterKeyPress',
            datechange: 'onTodosListDateChange',
            coursesectionchange: 'onTodosListCourseSectionChange'
        }
    },

    listen: {
        store: {
            '#Todos': {
                beforeload: 'onTodosStoreBeforeLoad',
                load: 'onTodosStoreLoad'
            }
        }
    },


    // event handlers
    onTodosListBoxReady: function() {
        var store = this.getTodosStore();

        if (!store.isLoaded() && !store.isLoading()) {
            store.load();
        }
    },

    onTodosStoreBeforeLoad: function(store) {
        var courseSection = this.getTodoList().getCourseSection(),
            params = {};

        if (courseSection) {
            params = {
                'course_section': courseSection
            };
        }
        store.getProxy().extraParams = params;
    },

    onTodosStoreLoad: function(store) {
        var me = this,
            todoList = me.getTodoList();

        todoList.update(me.formatTodoLists(store.getRange()));
        todoList.restoreVisibilityState();
    },

    onTodosListCheckClick: function(cmp, parentId, recordId, checked) {
        var me = this,
            todosStore = me.getTodosStore().getById(parentId).Todos(), // eslint-disable-line new-cap
            rec = todosStore.getById(recordId);

        rec.set('Completed', checked);
        rec.save({
            success: function() {
                me.getTodosStore().load();
            },
            failure: function() {
                Ext.toast('Todo could not be updated.');
            }
        });
    },

    onTodosListClearCompletedClick: function(cmp, sectionId) {
        var me = this;

        Slate.API.request({     // eslint-disable-line no-undef
            url: '/cbl/todos/clear-section',
            params: {
                sectionId: sectionId
            },
            success: function() {
                me.getTodosStore().load();
            },
            failure: function() {
                Ext.toast('Todos could not be cleared.');
            }
        });
    },

    onTodosListEnterKeyPress: function(cmp, parentId) {
        this.insertNewTodo(parentId);
    },

    onTodosListDateChange: function(cmp, parentId) {
        this.insertNewTodo(parentId);
    },

    onTodosListCourseSectionChange: function() {
        this.getTodosStore().load();
    },


    // custom controller methods
    formatTodoLists: function(recs) {
        var me = this,
            recsLength = recs.length,
            todoSections = [],
            i = 0,
            rec,
            todos;


        for (;i<recsLength; i++) {
            rec = recs[i];

            todos = me.formatTodos(rec.Todos().getRange()); // eslint-disable-line new-cap

            Ext.apply(todos, {
                section: rec.get('Title'),
                sectionId: rec.get('SectionID'),
                todoCount: rec.get('TodoCount'),
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
                buttons: [{
                    icon: 'times',
                    action: 'clear',
                    text: 'Clear All'
                }, {
                    icon: 'caret-up',
                    action: 'hide',
                    text: 'Hide'
                }],
                items: completeTodos
            });
        }

        return { todos: todos };
    },

    insertNewTodo: function(parentId) {
        var textfield = Ext.dom.Query.select('input.slate-todolist-new-item-text[data-parent-id="'+parentId)[0],
            datefield = Ext.dom.Query.select('input.slate-todolist-new-item-date[data-parent-id="'+parentId)[0],
            dueDate = new Date(datefield.value.replace(/-/g, '/')).getTime() / 1000,
            store = this.getTodosStore(),
            parentRec = store.getById(parentId),
            rec;

        if (textfield.value && datefield.value) {
            rec = this.getTodoModel().create({
                SectionID: parentRec.get('SectionID'),
                StudentID: parentRec.get('StudentID'),
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
