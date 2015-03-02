/*jslint browser: true, undef: true *//*global Ext*/
// @require-package slate-cbl
Ext.define('Site.page.TeacherCompetencyDashboard', {
    singleton: true,
    requires: [
        'Site.Common',
        'Slate.cbl.view.teacher.Dashboard',
        'Ext.QuickTips'
    ],

    constructor: function() {
        Ext.onReady(this.onDocReady, this);
    },

    onDocReady: function() {
        var me = this,
            body = Ext.getBody(),
            teacherDashboardCt = body.down('#teacherDashboardCt'),
            siteEnv = window.SiteEnvironment || {},
            studentsData = siteEnv.cblStudents,
            contentAreaData = siteEnv.cblContentArea || null,
            dashboard,
            studentDataStore;

        // ensure students are loaded
        if (!studentsData || !studentsData.length) {
            return;
        }

        // initialize QuickTips
        Ext.QuickTips.init();

        // empty content editor container
        teacherDashboardCt.empty();

        // render teacher dashboard component
        me.dashboard = dashboard = Ext.create('Slate.cbl.view.teacher.Dashboard', {
            renderTo: teacherDashboardCt,
            contentArea: contentAreaData
        });

        // load data embedded in page
        studentsDataStore = Ext.getStore('cbl-students-loaded');

        studentsDataStore.sorters.add(new Ext.util.Sorter({
            property : 'FullName',
            direction: 'ASC'
        }));

        studentsDataStore.loadRawData(studentsData);

        // wire Log a Demonstration button
        body.on('click', function(ev, t) {
            ev.stopEvent();

            dashboard.getController().showDemonstrationEditWindow();
        }, me, { delegate: 'button[data-action="demonstration-create"]'});
    }
});
