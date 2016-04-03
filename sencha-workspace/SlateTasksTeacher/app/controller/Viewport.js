Ext.define('SlateTasksTeacher.controller.Viewport', {
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
            dashboardCt, taskGrid;

        dashboardCt = this.getDashboardCt();
        taskGrid = dashboardCt.getTaskGrid();

        // configure dashboard with any available embedded data
        if (contentAreaCode) {
            taskGrid.setStudentDashboardLink('/cbl/student-dashboard?content-area=' + encodeURIComponent(contentAreaCode));
        }

        if (siteEnv.cblStudents) {
            taskGrid.getStudentsStore().loadData(siteEnv.cblStudents);
        }

        if (siteEnv.cblCompetencies) {
            taskGrid.getCompetenciesStore().loadData(siteEnv.cblCompetencies);
        }

        // render dashboard
        dashboardCt.render('slateapp-viewport');
    }
});