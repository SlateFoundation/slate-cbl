Ext.define('SlateDemonstrationsTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],


    views: [
        'Dashboard@Slate.cbl.view.teacher'
    ],

    config: {
        refs: {
            dashboardCt: {
                selector: 'slate-cbl-teacher-dashboard',
                autoCreate: true,

                xtype: 'slate-cbl-teacher-dashboard'
            }
        },
    },

    onLaunch: function () {
        var siteEnv = window.SiteEnvironment || {},
            contentAreaCode = (siteEnv.cblContentArea || {}).Code,
            dashboardCt, progressGrid;

        dashboardCt = this.getDashboardCt({});
        progressGrid = dashboardCt.getProgressGrid();

        // configure dashboard with any available embedded data
        if (contentAreaCode) {
            progressGrid.setStudentDashboardLink('/cbl/student-dashboard?content-area=' + escape(contentAreaCode));
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