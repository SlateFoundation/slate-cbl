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
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        var siteEnv = window.SiteEnvironment || {},
            cblStudentId = (siteEnv.cblStudent || {}).ID,
            cblContentArea = siteEnv.cblContentArea || null,
            recentProgressCmp, competenctCardCmp, dashboardCt;

        // fetch component instances
        dashboardCt = this.getDashboardCt();
        recentProgressCmp = dashboardCt.getRecentProgress();
        competenctCardCmp = dashboardCt.getCompetencyCard();

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
        dashboardCt.render('slateapp-viewport');
        Ext.resumeLayouts(true);
    }
});