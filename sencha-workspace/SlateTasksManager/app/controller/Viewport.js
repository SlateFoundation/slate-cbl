Ext.define('SlateTasksManager.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],

    views: [
        'TasksManager@Slate.cbl.view.teacher'
    ],

    config: {
        refs: {
            tasksManager: {
                selector: 'slate-tasksmanager',
                autoCreate: true,

                xtype: 'slate-tasksmanager'
            }
        },
    },

    onLaunch: function () {
        // render dashboard
        this.getTasksManager().render('slate-tasksmanager');
    }
});