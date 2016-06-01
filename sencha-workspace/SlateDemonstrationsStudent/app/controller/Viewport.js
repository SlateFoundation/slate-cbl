Ext.define('SlateDemonstrationsStudent.controller.Viewport', {
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
            selector: 'slate-demonstrations-student-dashboard',
            autoCreate: true,

            xtype: 'slate-demonstrations-student-dashboard'
        },
        recentProgressCmp: {
            selector: 'slate-demonstrations-student-recentprogress',
            autoCreate: true,

            xtype: 'slate-demonstrations-student-recentprogress'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        var siteEnv = window.SiteEnvironment || {},
            cblStudentId = (siteEnv.cblStudent || {}).ID,
            cblContentArea = siteEnv.cblContentArea || null,
            dashboardCt, recentProgressCmp;

        // fetch component instances
        dashboardCt = this.getDashboardCt();
        recentProgressCmp = this.getRecentProgressCmp();

        // configure recent progress component with any available embedded data
        if (cblStudentId) {
            recentProgressCmp.setStudentId(cblStudentId);
        }

        if (cblContentArea) {
            recentProgressCmp.setContentAreaId(cblContentArea);
        }

        // configure dashboard with any available embedded data
        if (cblStudentId) {
            dashboardCt.setStudentId(cblStudentId);
        }

        if (siteEnv.cblCompetencies) {
            dashboardCt.getCompetenciesStore().loadData(siteEnv.cblCompetencies);
        }

        // render components
        Ext.suspendLayouts();
        recentProgressCmp.render('slateapp-viewport');
        dashboardCt.render('slateapp-viewport');
        Ext.resumeLayouts(true);
    }
});