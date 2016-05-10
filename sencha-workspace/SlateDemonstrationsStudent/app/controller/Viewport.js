Ext.define('SlateDemonstrationsStudent.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],


    config: {
    },
    
    
    // controller configuration
    views: [
        'Dashboard@Slate.cbl.view.student',
        'RecentProgress@Slate.cbl.view.student'
    ],
    
    refs: {
        dashboardCt: {
            selector: 'slate-cbl-student-dashboard',
            autoCreate: true,

            xtype: 'slate-cbl-student-dashboard'
        },
        recentProgressCmp: {
            selector: 'slate-cbl-student-recentprogress',
            autoCreate: true,

            xtype: 'slate-cbl-student-recentprogress'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        var siteEnv = window.SiteEnvironment || {},
            cblStudentId = (siteEnv.cblStudent || {}).ID,
            cblContentArea = siteEnv.cblContentArea || null,
            recentProgressCmp, dashboardCt;

        // fetch component instances
        recentProgressCmp = this.getRecentProgressCmp();
        dashboardCt = this.getDashboardCt();

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