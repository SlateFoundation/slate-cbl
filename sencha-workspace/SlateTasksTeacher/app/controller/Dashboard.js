/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('SlateTasksTeacher.controller.Dashboard', {
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
      dashboardCt: 'slate-tasks-teacher-dashboard',
      
      taskGrid: 'slate-tasks-teacher-dashboard slate-tasks-teacher-studentstaskgrid'
    },


    config: {
        control: {
            taskGrid: {
                competencyrowclick: 'onCompetencyRowClick'
            }
        }
    },


    listen: {
    },
    
    // event handlers 
    onCompetencyRowClick: function(me, competency, ev, targetEl) {
        me.toggleCompetency(competency);
    },

});