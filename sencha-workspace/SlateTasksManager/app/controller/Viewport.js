Ext.define('SlateTasksManager.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],

    views: [
        'TasksManager'
    ],

    config: {
        refs: {
            tasksManager: {
                selector: 'slate-tasks-manager',
                autoCreate: true,

                xtype: 'slate-tasks-manager'
            }
        }
    },

    onLaunch: function () {
        // render dashboard
        this.getTasksManager().render('slate-tasks-manager');
    }
});