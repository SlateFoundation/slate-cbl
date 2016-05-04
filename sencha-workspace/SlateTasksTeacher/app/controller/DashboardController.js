/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('SlateTasksTeacher.controller.DashboardController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.slate-tasks-teacher-dashboard',
    requires: [
        'Jarvus.util.APIDomain',

        'Slate.API',

        'Slate.cbl.view.teacher.skill.OverviewWindow',
        'Slate.cbl.view.teacher.skill.OverrideWindow',
        'Slate.cbl.view.teacher.demonstration.EditWindow'
    ],
    
    refs: {
      dashboardCt: 'slate-tasks-teacher-dashboard'
    },


    config: {
    },


    listen: {
    }

});