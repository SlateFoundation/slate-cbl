Ext.define('SlateTasksStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],

    // entry points
    control: {
        'slatetasksstudent-tasktree': {
            resize: 'onTaskTreeResize'
        }
    },


    // controller configuration
    views: [
        'Dashboard',
        'AppHeader',
        'TaskTree',
        'TodoList',
        'RecentActivity',
        'Slate.cbl.view.student.TaskHistory'
    ],

    refs: {
        dashboard: {
            selector: 'slatetasksstudent-dashboard',
            autoCreate: true,

            xtype: 'slatetasksstudent-dashboard'
        },
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
            selector: 'slatetasksstudent-recentactivity',
            autoCreate: true,

            xtype: 'slatetasksstudent-recentactivity'
        },
        taskHistory: {
            selector: 'slate-taskhistory',
            autoCreate: true,

            xtype: 'slate-taskhistory'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        this.getDashboard().render('slateapp-viewport');

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
