Ext.define('SlateDemonstrationsTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],


    views: [
        'Dashboard@SlateDemonstrationsTeacher.view.main'
    ],

    config: {
        refs: {
            dashboardCt: {
                selector: 'slate-demonstrations-teacher-dashboard',
                autoCreate: true,

                xtype: 'slate-demonstrations-teacher-dashboard'
            }
        },
    },

    onLaunch: function () {
        var siteEnv = window.SiteEnvironment || {},
            contentAreaCode = (siteEnv.cblContentArea || {}).Code,
            dashboardCt, progressGrid;

        dashboardCt = this.getDashboardCt();
        progressGrid = dashboardCt.getProgressGrid();

        // configure dashboard with any available embedded data
        if (contentAreaCode) {
            progressGrid.setStudentDashboardLink('/cbl/student-dashboard?content-area=' + encodeURIComponent(contentAreaCode));
        }

        if (siteEnv.cblStudents) {
            progressGrid.getStudentsStore().loadData(siteEnv.cblStudents);
        }

        if (siteEnv.cblCompetencies) {
            progressGrid.getCompetenciesStore().loadData(siteEnv.cblCompetencies);
        }

        // render dashboard
        dashboardCt.render('slateapp-viewport');
    }
});