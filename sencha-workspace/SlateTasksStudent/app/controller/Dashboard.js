Ext.define('SlateTasksStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],

    // entry points
    control: {
        'slate-tasktree': {
            resize: 'onTaskTreeResize'
        }
    },


    config: {
    },


    // controller configuration
    views: [
        'AppHeader',
        'TaskTree',
        'TodoList',
        'RecentActivity',
        'Slate.cbl.view.student.TaskHistory'
    ],

    refs: {
        appHeader: {
            selector: 'slatetasksstudent-appheader',
            autoCreate: true,

            xtype: 'slatetasksstudent-appheader'
        },
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
        recentActivity: {
            selector: 'slate-recentactivity',
            autoCreate: true,

            xtype: 'slate-recentactivity'
        },
        taskHistory: {
            selector: 'slate-taskhistory',
            autoCreate: true,

            xtype: 'slate-taskhistory'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        this.getAppHeader().render('slate-appheader');
        this.getTaskTree().render('slate-tasktree');
        this.getTodoList().render('slate-todolist');
        this.getRecentActivity().render('slate-recentactivity');
        this.getTaskHistory().render('slate-taskhistory');

    },

    onTaskTreeResize: function () {
        this.maskDemoElements();
    },

    maskDemoElements: function () {
        this.getTodoList().setLoading(false);
        this.getRecentActivity().setLoading(false);
        this.getTaskHistory().setLoading(false);

        this.getTodoList().setLoading('');
        this.getRecentActivity().setLoading('');
        this.getTaskHistory().setLoading('');
    }
});
