/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext*/
// @require-package slate-cbl
Ext.define('Site.page.StudentCompetencyDashboard', {
    singleton: true,
    requires: [
        'Ext.QuickTips',

        'Slate.cbl.view.student.Dashboard',
        'Slate.cbl.view.student.RecentProgress',

        'Slate.cbl.store.Competencies'
    ],

    constructor: function() {
        Ext.onReady(this.onDocReady, this);
    },

    onDocReady: function() {
        var me = this,
            siteEnv = window.SiteEnvironment || {},
            cblStudentId = (siteEnv.cblStudent || {}).ID,
            cblContentArea = siteEnv.cblContentArea || null;
            // contentAreaEl = body.down('select[name="content-area"]');

        // initialize QuickTips
        Ext.QuickTips.init();

        // render student dashboard component
        me.dashboard = Ext.create('Slate.cbl.view.student.Dashboard', {
            renderTo: Ext.get('studentDashboardCt'),
            studentId: cblStudentId,
            competenciesStore: {
                xclass: 'Slate.cbl.store.Competencies',
                data: siteEnv.cblCompetencies
            }
        });

        // render student recent progress component
        me.recentProgress = Ext.create('Slate.cbl.view.student.RecentProgress', {
            renderTo: Ext.get('studentDashboardRecentProgress'),
            studentId: cblStudentId,
            contentAreaId: cblContentArea && cblContentArea.ID
        });
        
        // contentAreaEl.on('change', function(ev, t) {
            // Placeholder for future functionality
        // });
    }
});
