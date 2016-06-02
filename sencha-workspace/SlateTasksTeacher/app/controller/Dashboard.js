/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('SlateTasksTeacher.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Jarvus.util.APIDomain',

        'Slate.API',
    ],


    config: {
    },


    // entry points
    listen: {
    },

    control: {
        taskGrid: {
            competencyrowclick: 'onCompetencyRowClick'
        }
    },


    // controller configuration
    views: [
    ],

    refs: {
      dashboardCt: 'slate-tasks-teacher-dashboard',

      taskGrid: 'slate-tasks-teacher-dashboard slate-tasks-teacher-studentstaskgrid'
    },


    // event handlers
    onCompetencyRowClick: function(me, competency, ev, targetEl) {
        me.toggleCompetency(competency);
    },

});