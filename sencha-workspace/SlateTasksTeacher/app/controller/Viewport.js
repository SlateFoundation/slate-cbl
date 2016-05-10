Ext.define('SlateTasksTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],
    
    
    config: {
    },
    
    
    // controller configuration
    views: [
        'Dashboard'
    ],

    refs: {
        dashboardCt: {
            selector: 'slate-tasks-teacher-dashboard',
            autoCreate: true,
            
            xtype: 'slate-tasks-teacher-dashboard'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        var dashboardCt;
        
        dashboardCt = this.getDashboardCt();      
        dashboardCt.render('slateapp-viewport')
    }
});