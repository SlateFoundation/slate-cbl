Ext.define('SlateModals.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],

    views: [
        'Modals@Slate.cbl.view.modals'
    ],

    config: {
        refs: {
            tasksManager: {
                selector: 'slate-modals',
                autoCreate: true,

                xtype: 'slate-modals'
            }
        }
    },

    onLaunch: function () {
        // render dashboard
        this.getTasksManager().render('slate-modals');
    }
});