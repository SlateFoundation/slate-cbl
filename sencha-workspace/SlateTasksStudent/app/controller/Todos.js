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
        'TodoGroups'
    ],

    models: [
        'Todo'
    ],


    // component references
    refs: {
        dashboardCt: 'slate-tasks-student-dashboard',
        todoList: 'slate-tasks-student-todolist'
    },


    // entry points
    control: {
        dashboardCt: {
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
        var todoGroupsStore = this.getTodoGroupsStore();

        this.getTodoList().setReadOnly(studentUsername !== false);

        todoGroupsStore.setStudent(studentUsername);
        todoGroupsStore.loadIfDirty();
    },

    onSectionChange: function(dashboardCt, sectionCode) {
        var todoGroupsStore = this.getTodoGroupsStore();

        todoGroupsStore.setSection(sectionCode);
        todoGroupsStore.loadIfDirty();
    },

    onTaskSubmit: function(todoList, todoData, sectionEl) {
        var me = this,
            todo = me.getTodoModel().create(todoData),
            todoGroupsStore = me.getTodoGroupsStore(),
            todoGroup = todoGroupsStore.getAt(todoGroupsStore.findExact('sectionId', todo.get('SectionID'))),
            inputEls = sectionEl.select('input:not([type=checkbox])');

        inputEls.set({
            disabled: ''
        });

        todo.save({
            success: function() {
                todoGroup.get('todos').add(todo);
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
            todoGroupsStore = me.getTodoGroupsStore(),
            todoGroup = todoGroupsStore.getAt(todoGroupsStore.findExact('sectionId', sectionId)),
            todo = todoGroup.get('todos').getByKey(todoId);

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
            todoGroupsStore = me.getTodoGroupsStore(),
            todoGroup = todoGroupsStore.getAt(todoGroupsStore.findExact('sectionId', sectionId));

        Slate.API.request({
            method: 'POST',
            url: '/cbl/todos/!clear',
            params: {
                'course_section': sectionId
            },
            success: function(response) {
                todoGroup.get('todos').add(response.data.data);
                todoList.refresh();
            },
            failure: function() {
                Ext.toast('Todos could not be cleared.');
            }
        });
    }
});