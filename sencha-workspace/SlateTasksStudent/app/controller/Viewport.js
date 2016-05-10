Ext.define('SlateTasksStudent.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],
    
    
    config: {
    },


    // controller configuration
    views: [
        'TaskTree@Slate.cbl.view.student',
        'TodoList@Slate.cbl.view.student'
    ],
    
    refs: {
        taskTree: {
            selector: 'slate-tasktree',
            autoCreate: true,

            xtype: 'slate-tasktree'
        },
        todoList: {
            selector: 'slate-todolist',
            autoCreate: true,

            xtype: 'slate-todolist'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        // render dashboard
        this.getTaskTree().render('slate-tasktree');
        this.getTodoList().render('slate-todolist');
    }
});