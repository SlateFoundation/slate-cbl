/**
 * The Todos controller manages the student todo list
 */
Ext.define('SlateTasksStudent.controller.Todos', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.form.field.Date',
        'Ext.window.Toast',

        /* global Slate */
        'Slate.API'
    ],


    // dependencies
    stores: [
        'Todos'
    ],

    models: [
        'Todo'
    ],


    // component references
    refs: {
        todoList: 'slatetasksstudent-todolist'
    },


    // entry points
    listen: {
        store: {
            '#Todos': {
                beforeload: 'onTodosStoreBeforeLoad',
                load: 'onTodosStoreLoad'
            }
        }
    },

    control: {
        todoList: {
            tasksubmit: 'onTaskSubmit',
            checkclick: 'onTodosListCheckClick',
            clearcompleted: 'onTodosListClearCompletedClick',
            coursesectionchange: 'onTodosListCourseSectionChange'
        }
    },


    // event handlers
    onTodosStoreBeforeLoad: function(store) {
        var proxy = store.getProxy(),
            todoList = this.getTodoList(),
            courseSection = todoList.getCourseSection(),
            student = todoList.getStudent();

        if (courseSection) {
            proxy.setExtraParam('course_section', courseSection);
        }

        if (student) {
            proxy.setExtraParam('student', student);
        }
    },

    onTodosStoreLoad: function() {
        this.refreshTodoLists();
    },

    onTaskSubmit: function(todoList, todoData, sectionEl) {
        var me = this,
            todo = me.getTodoModel().create(todoData),
            store = me.getTodosStore(),
            todoSection = store.getAt(store.findExact('SectionID', todo.get('SectionID'))),
            inputEls = sectionEl.select('input:not([type=checkbox])');

        inputEls.set({
            disabled: ''
        });

        todo.save({
            success: function() {
                todoSection.Todos().add(todo); // eslint-disable-line new-cap
                me.refreshTodoLists();
            },
            failure: function() {
                Ext.toast('Todo could not be created.');
                inputEls.set({
                    disabled: undefined // eslint-disable-line no-undefined
                });
            }
        });
    },

    onTodosListCheckClick: function(todoList, sectionId, todoId, checked) {
        var me = this,
            store = me.getTodosStore(),
            todoSection = store.getAt(store.findExact('SectionID', sectionId)),
            todo = todoSection.Todos().getById(todoId); // eslint-disable-line new-cap

        todo.set('Completed', checked);

        todo.save({
            success: function() {
                me.refreshTodoLists();
            },
            failure: function() {
                Ext.toast('Todo could not be updated.');
            }
        });
    },

    onTodosListClearCompletedClick: function(cmp, sectionId) {
        var me = this;

        Slate.API.request({
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

    onTodosListCourseSectionChange: function() {
        this.getTodosStore().load();
    },


    // custom controller methods
    // TODO: move refresh and build data logic to view
    refreshTodoLists: function() {
        var me = this,
            todoList = me.getTodoList();

        todoList.update(me.buildTodoListsData());
    },

    buildTodoListsData: function() {
        var me = this,
            todoList = me.getTodoList(),
            readOnly = todoList.getReadOnly(),
            collapsedSections = todoList.collapsedSections,
            recs = me.getTodosStore().getRange(),
            recsLength = recs.length,
            todoSections = [],
            i = 0,
            rec, sectionId;

        for (;i<recsLength; i++) {
            rec = recs[i];
            sectionId = rec.get('SectionID');

            todoSections.push({
                ID: rec.get('ID'),
                section: rec.get('Title'),
                sectionId: sectionId,
                studentId: rec.get('StudentID'),
                todoCount: rec.get('TodoCount'),
                readOnly: readOnly,
                collapsed: Boolean(collapsedSections[sectionId]),
                todos: me.buildTodoListData(rec.Todos().getRange()) // eslint-disable-line new-cap
            });
        }

        return todoSections;
    },

    buildTodoListData: function(todos) {
        var readOnly = this.getTodoList().getReadOnly(),
            todosLength = todos.length,
            i = 0,
            todosData = [],
            completeTodos = [],
            activeTodos = [],
            buttons = [],
            rec;

        for (;i<todosLength; i++) {
            rec = todos[i];

            if (rec.get('Completed')) {
                completeTodos.push(rec.getData());
            } else {
                activeTodos.push(rec.getData());
            }
        }

        todosData.push({
            Title: 'Active Items',
            readOnly: readOnly,
            canAdd: true,
            items: activeTodos
        });

        if (!readOnly) {
            buttons = [{
                icon: 'times',
                action: 'clear',
                text: 'Clear All'
            }, {
                icon: 'caret-up',
                action: 'hide',
                text: 'Hide'
            }];
        }

        if (completeTodos.length > 0) {
            todosData.push({
                Title: 'Completed Items',
                readOnly: readOnly,
                buttons: buttons,
                items: completeTodos
            });
        }

        return todosData;
    }
});