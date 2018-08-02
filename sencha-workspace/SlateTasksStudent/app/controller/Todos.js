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
        dashboard: 'slate-tasks-student-dashboard',
        todoList: 'slate-tasks-student-todolist'
    },


    // entry points
    control: {
        dashboard: {
            studentchange: 'onStudentChange',
            sectionchange: 'onSectionChange'
        },
        todoList: {
            tasksubmit: 'onTaskSubmit',
            checkclick: 'onTodosListCheckClick',
            clearclick: 'onTodosListClearClick'
        }
    },


    // event handlers
    onStudentChange: function(dashboardCt, studentUsername) {
        var todosStore = this.getTodosStore();

        this.getTodoList().setReadOnly(studentUsername !== false);

        todosStore.setStudent(studentUsername);
        todosStore.loadIfDirty();
    },

    onSectionChange: function(dashboardCt, sectionCode) {
        var todosStore = this.getTodosStore();

        todosStore.setSection(sectionCode);
        todosStore.loadIfDirty();
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
                todoList.refresh();
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
                todoList.refresh();
            },
            failure: function() {
                Ext.toast('Todo could not be updated.');
            }
        });
    },

    onTodosListClearClick: function(todoList, sectionId) {
        var me = this,
            store = me.getTodosStore(),
            todosStore = store.getAt(store.findExact('SectionID', sectionId)).Todos(); // eslint-disable-line new-cap

        Slate.API.request({
            url: '/cbl/todos/clear-section',
            params: {
                sectionId: sectionId
            },
            success: function() {
                todosStore.remove(todosStore.queryBy(function(todo) {
                    return todo.get('Completed');
                }).getRange());

                todoList.refresh();
            },
            failure: function() {
                Ext.toast('Todos could not be cleared.');
            }
        });
    }
});