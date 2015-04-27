/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext*/
// @require-package slate-cbl
Ext.define('Site.page.StudentCompetencyDashboard', {
    singleton: true,
    requires: [
        'Slate.cbl.model.Student',
        'Slate.cbl.view.student.Dashboard',
        'Slate.cbl.view.student.RecentProgress',
        'Ext.QuickTips'
    ],

    constructor: function() {
        Ext.onReady(this.onDocReady, this);
    },

    onDocReady: function() {
        var me = this,
            siteEnv = window.SiteEnvironment || {},
            cblStudent = siteEnv.cblStudent || null,
            cblContentArea = siteEnv.cblContentArea || null;
            // body = Ext.getBody()
            // contentAreaEl = body.down('select[name="content-area"]');

        // ensure student is defined
        if (!siteEnv.cblStudent) {
            return;
        }

        // initialize QuickTips
        Ext.QuickTips.init();

        // render student dashboard component
        me.dashboard = Ext.create('Slate.cbl.view.student.Dashboard', {
            renderTo: Ext.get('studentDashboardCt'),
            student: cblStudent,
            contentArea: cblContentArea
        });
        Ext.QuickTips.init();

        // render student recent progress component
        me.recentProgress = Ext.create('Slate.cbl.view.student.RecentProgress', {
            renderTo: Ext.get('studentDashboardRecentProgress'),
            studentId: cblStudent && cblStudent.ID,
            contentAreaId: cblContentArea && cblContentArea.ID
        });
        
        // contentAreaEl.on('change', function(ev, t) {
            // Placeholder for future functionality
        // });
    }
});
