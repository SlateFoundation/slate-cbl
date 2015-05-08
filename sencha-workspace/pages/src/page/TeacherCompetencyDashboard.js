/*jslint browser: true, undef: true *//*global Ext*/
// @require-package slate-cbl

Ext.define('Site.page.TeacherCompetencyDashboard', {
    extend: 'Site.PageApp',
    singleton: true,
    requires: [
//        'Slate.cbl.view.teacher.Dashboard',
//        'Slate.cbl.store.Students'
    ],

    // app config
    name: 'TeacherCompetencyDashboard',
    namespace: 'Slate.cbl',
    enableQuickTips: true,
    stores: ['Students', 'Competencies'],

    // app lifecycle methods
    launch: function() {
        debugger;
        console.log('launch', Ext.getBody().down('#teacherDashboardCt'), Slate.cbl.model.ContentArea);
    }
    
//    onDocReady: function() {
//        console.log('onDocReady', Ext.getBody().down('#teacherDashboardCt'));

//        var me = this,
//            body = Ext.getBody(),
//            teacherDashboardCt = body.down('#teacherDashboardCt'),
//            siteEnv = window.SiteEnvironment || {},
//            studentsData = siteEnv.cblStudents,
//            contentAreaData = siteEnv.cblContentArea || null,
//            dashboard;
//
//        // ensure students are loaded
//        if (!studentsData || !studentsData.length) {
//            return;
//        }
//
//        // initialize QuickTips
//        Ext.QuickTips.init();
//
//
//        // empty content editor container
//        teacherDashboardCt.empty();
//
//
//        // render teacher dashboard component
//        me.dashboard = dashboard = Ext.create('Slate.cbl.view.teacher.Dashboard', {
//            renderTo: teacherDashboardCt,
//            contentArea: contentAreaData
//        });
//
//
//        // load data embedded in page
//        Slate.cbl.store.Students.loadRawData(studentsData);
//
//
//        // wire Log a Demonstration button
//        body.on('click', function(ev, t) {
//            ev.stopEvent();
//
//            dashboard.getController().showDemonstrationEditWindow();
//        }, me, { delegate: 'button[data-action="demonstration-create"]'});
//    }
});