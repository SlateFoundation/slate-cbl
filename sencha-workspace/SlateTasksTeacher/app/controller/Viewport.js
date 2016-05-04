Ext.define('SlateTasksTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],


    views: [
        'Dashboard'
    ],

    config: {
        refs: {
            dashboardCt: {
                selector: 'slate-tasks-teacher-dashboard',
                autoCreate: true,
                
                xtype: 'slate-tasks-teacher-dashboard'
            }
        },
    },

    onLaunch: function () {
        var dashboardCt;
        
        dashboardCt = this.getDashboardCt();      
        dashboardCt.render('slateapp-viewport')
    }
});