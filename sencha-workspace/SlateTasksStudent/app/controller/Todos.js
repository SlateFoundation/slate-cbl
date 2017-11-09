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

    // onTodosListEnterKeyPress: function(cmp, parentId) {
    //     this.insertNewTodo(parentId);
    // },

    // onTodosListDateChange: function(cmp, parentId) {
    //     this.insertNewTodo(parentId);
    // },

    onTodosListCourseSectionChange: function() {
        this.getTodosStore().load();
    },


    // custom controller methods
    refreshTodoLists: function() {
        var me = this,
            todoList = me.getTodoList();


        todoList.update(me.buildTodoListsData());
        todoList.restoreVisibilityState();
    },

    buildTodoListsData: function() {
        var me = this,
            readOnly = me.getTodoList().getReadOnly(),
            recs = me.getTodosStore().getRange(),
            recsLength = recs.length,
            todoSections = [],
            i = 0,
            rec;

        for (;i<recsLength; i++) {
            rec = recs[i];

            todoSections.push({
                ID: rec.get('ID'),
                section: rec.get('Title'),
                sectionId: rec.get('SectionID'),
                studentId: rec.get('StudentID'),
                todoCount: rec.get('TodoCount'),
                readOnly: readOnly,
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

//     insertNewTodo: function(parentId) {
//         var textfield = Ext.dom.Query.select('input.slate-todolist-new-item-text[data-parent-id="'+parentId)[0],
//             datefield = Ext.dom.Query.select('input.slate-todolist-new-item-date[data-parent-id="'+parentId)[0],
//             dueDate = new Date(datefield.value.replace(/-/g, '/')).getTime() / 1000,
//             store = this.getTodosStore(),
//             parentRec = store.getById(parentId),
//             rec;
// debugger;
//         if (textfield.value && datefield.value) {
//             rec = this.getTodoModel().create({
//                 SectionID: parentRec.get('SectionID'),
//                 StudentID: parentRec.get('StudentID'),
//                 Description: textfield.value,
//                 DueDate: dueDate
//             });

//             rec.save({
//                 success: function() {
//                     store.load();
//                 },
//                 failure: function() {
//                     Ext.toast('Todo could not be created.');
//                 }
//             });
//         }
//     }
});