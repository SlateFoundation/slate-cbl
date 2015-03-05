/*jslint browser: true, undef: true *//*global Ext*/
// @require-package slate-cbl
Ext.define('Site.page.StudentCompetencyDashboard', {
    singleton: true,
    requires: [
        'Site.Common',
        'Slate.cbl.model.Student',
        'Slate.cbl.view.student.Dashboard',
        'Ext.QuickTips',
        'Ext.XTemplate'
    ],

    constructor: function() {
        Ext.onReady(this.onDocReady, this);
    },

    onDocReady: function() {
        var me = this,
            siteEnv = window.SiteEnvironment || {};

        // ensure student is defined
        if (!siteEnv.cblStudent) {
            return;
        }

        // initialize QuickTips
        Ext.QuickTips.init();

        // render student dashboard component
        me.dashboard = Ext.create('Slate.cbl.view.student.Dashboard', {
            renderTo: Ext.get('studentDashboardCt'),
            contentArea: siteEnv.cblContentArea || null
        });
    }
});
