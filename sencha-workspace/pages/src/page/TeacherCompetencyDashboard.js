/*jslint browser: true, undef: true *//*global Ext*/
// @require-package slate-cbl
Ext.define('Site.page.TeacherCompetencyDashboard', {
    singleton: true,
    requires: [
        'Ext.QuickTips',

        'Slate.cbl.store.Students',
        'Slate.cbl.view.teacher.Dashboard'
    ],

    constructor: function() {
        Ext.onReady(this.onDocReady, this);
    },

    onDocReady: function() {
        var me = this,
            body = Ext.getBody(),
            teacherDashboardCt = body.down('#teacherDashboardCt'),
            siteEnv = window.SiteEnvironment || {},
            contentAreaCode = (siteEnv.cblContentArea || {}).Code,
            dashboardView;

        // initialize QuickTips
        Ext.QuickTips.init();


        // empty content editor container
        teacherDashboardCt.empty();


        // render teacher dashboard component
        me.dashboardView = dashboardView = Ext.create('Slate.cbl.view.teacher.Dashboard', {
            renderTo: teacherDashboardCt,
            progressGrid: {
                studentDashboardLink: contentAreaCode && '/cbl/student-dashboard?content-area=' + escape(contentAreaCode),
                studentsStore: {
                    xclass: 'Slate.cbl.store.Students',
                    data: siteEnv.cblStudents
                },
                competenciesStore: {
                    xclass: 'Slate.cbl.store.Competencies',
                    data: siteEnv.cblCompetencies
                }
            }
        });


        // wire Log a Demonstration button
        body.on('click', function(ev, t) {
            ev.stopEvent();

            dashboardView.getController().showDemonstrationEditWindow();
        }, me, { delegate: 'button[data-action="demonstration-create"]'});
    }
});