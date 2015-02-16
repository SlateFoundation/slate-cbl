/*jslint browser: true, undef: true *//*global Ext*/
// @require-package slate-cbl
Ext.define('Site.page.StudentCompetencyDashboard', {
    singleton: true,
    requires: [
        'Site.Common',
        'Ext.QuickTips',
        'Slate.cbl.view.student.Dashboard',
        'Slate.cbl.model.Student',
        'Ext.XTemplate'
    ],



    constructor: function() {
        Ext.onReady(this.onDocReady, this);
    },

    onDocReady: function() {
         var me = this,
            body = Ext.getBody(),
            studentDashboardCt = body.down('#studentDashboardCt'),
            siteEnv = window.SiteEnvironment || {},
            contentAreaData = siteEnv.cblContentArea || null,
            dashboard;

        // ensure student is loaded
        if (!siteEnv.cblStudent) {
            return;
        }

        // initialize QuickTips
        Ext.QuickTips.init();


        // empty content editor container
        studentDashboardCt.empty();


        // render teacher dashboard component
        me.dashboard = dashboard = Ext.create('Slate.cbl.view.student.Dashboard', {
            renderTo: studentDashboardCt,
            contentArea: contentAreaData
        });
        
        body.on('click', function(ev, t) {
            ev.stopEvent();

            window.open('https://tinyurl.com/SDPcompetencycontinua', '_blank');
        }, me, { delegate: 'button[data-action="view-the-continua"]'});
    }
});