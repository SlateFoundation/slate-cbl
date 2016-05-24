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
        'TodoList@Slate.cbl.view.student',
        'TaskHistory@Slate.cbl.view.student',
        'OverallProgress@Slate.cbl.view.student'
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
        },
        taskHistory: {
            selector: 'slate-taskhistory',
            autoCreate: true,

            xtype: 'slate-taskhistory'
        },
        overallProgress: {
            selector: 'slate-overallprogress',
            autoCreate: true,

            xtype: 'slate-cbl-student-overallprogress'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        this.getTaskTree().render('slate-tasktree');
        this.getTodoList().render('slate-todolist');
        this.getTaskHistory().render('slate-taskhistory');
        this.getOverallProgress().render('slate-overallprogress');
    }
});
